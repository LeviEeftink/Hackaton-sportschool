from pathlib import Path
import base64, zlib, urllib.request, json, hashlib
from datetime import datetime, timezone
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
ROOT.mkdir(exist_ok=True, parents=True)
COMMON = '''skinparam backgroundColor white
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 15
skinparam ArrowColor #35536B
skinparam roundcorner 8
skinparam classBackgroundColor #F2F6FA
skinparam classBorderColor #35536B
skinparam activityBackgroundColor #F2F6FA
skinparam activityBorderColor #35536B
skinparam usecaseBackgroundColor #F2F6FA
skinparam usecaseBorderColor #35536B
'''
DIAGRAMS = {
'klassendiagram': '''@startuml
''' + COMMON + '''hide circle
skinparam classAttributeIconSize 0
class Gebruiker {
  id: integer
  email: string {uniek}
  rol: lid | medewerker | admin | coach
}
class Lid {
  id: integer
  naam: string
  email: string {uniek}
  status: Status
  +controleerToegang(): Toegangspoging
}
class Abonnement {
  id: integer
  type: Abonnementstype
  status: Status
  startDatum: date
  eindDatum: date [0..1]
  bezoekenDezeWeek: integer
  weekStart: date <<nieuw>>
  heeftCursusAddendum: boolean
  +weekMaximum(): integer
  +resetBijNieuweWeek(): void
}
class Toegangspoging {
  id: integer
  datumTijd: datetime
  resultaat: Toegestaan | Geweigerd
  reden: string
  verzoekId: UUID <<nieuw, uniek per lid>>
}
Gebruiker "0..1" -- "0..1" Lid : lidprofiel
Lid "0..1" -- "0..1" Abonnement : persoonlijk abonnement
Lid "1" -- "0..*" Toegangspoging : heeft
Lid ..> Abonnement : controleert
note bottom of Abonnement
  Type: EenKeerPerWeek, TweeKeerPerWeek,
  Onbeperkt of CursusAddendum.
  Status: Actief, Inactief, Geannuleerd, Bevestigd.
end note
@enduml
''',
'usecasediagram': '''@startuml
''' + COMMON + r'''left to right direction
actor "Lid" as L
actor "Medewerker" as M
actor "Beheerder" as A
A --|> M
rectangle "Sportschool De Kast - toegang" {
  usecase "UC-01\nInloggen / uitloggen" as U1
  usecase "UC-02\nEigen abonnement bekijken" as U2
  usecase "UC-03\nInchecken" as U3
  usecase "UC-04\nEigen toegangshistorie bekijken" as U4
  usecase "UC-05\nAbonnement beheren" as U5
  usecase "UC-06\nToegangspogingen raadplegen" as U6
  usecase "Toegangsrecht bepalen" as R
  usecase "Beslissing registreren" as G
  usecase "UC-07\nRollen beheren" as U7
}
L -- U1
L -- U2
L -- U3
L -- U4
M -- U1
M -- U5
M -- U6
A -- U7
U3 ..> R : <<include>>
U3 ..> G : <<include>>
note bottom of U3
  Voorwaarde: geldige sessie en eigen lidprofiel.
  Een technische fout breekt de check-in af.
end note
@enduml
''',
'activiteitendiagram': '''@startuml
''' + COMMON + r'''skinparam defaultFontSize 14
skinparam activityDiamondBackgroundColor #E7EEF5
|Lid|
start
:Klik op Inchecken;
|Server|
:Start transactie voor\nhet eigen lid;
:Lees lid en abonnement,\nreset teller bij nieuwe week;
:Bepaal geldigheid en\nmaximum: 1, 2, oneindig of 0;
if (Geldig en\nbezoeken < maximum?) then (ja)
  :Besluit = Toegestaan,\nverhoog teller met 1;
else (nee)
  :Besluit = Geweigerd,\nbepaal concrete reden;
endif
:Sla poging op met\nserverdatum en verzoekId,\nvoer commit uit;
if (Opslaan en commit gelukt?) then (ja)
  :Antwoord = besluit,\nreden en actuele teller;
else (nee)
  :Draai wijzigingen terug,\nverleen geen toegang;
  :Antwoord = storing,\nopnieuw proberen;
endif
|Lid|
:Bekijk antwoord;
stop
@enduml
'''
}

DIAGRAMS['klassendiagram'] = r'''@startuml
top to bottom direction
skinparam backgroundColor white
skinparam shadowing false
skinparam roundcorner 0
skinparam defaultFontName Arial
skinparam defaultFontSize 17
skinparam classAttributeIconSize 0
skinparam classBackgroundColor white
skinparam classHeaderBackgroundColor white
skinparam classBorderColor black
skinparam ArrowColor black
skinparam ArrowThickness 1.4
skinparam classBorderThickness 1
skinparam linetype ortho
skinparam nodesep 70
skinparam ranksep 65
skinparam classFontStyle bold
hide circle
abstract class Persoon {
  -id: int
  -naam: String
  -email: String
  -status: Status
  --
  +WijzigGegevens(): void
  +WijzigStatus(status: Status): void
}
class Lid <<entity>> {
  -abonnement: Abonnement
  --
  +KoppelAbonnement(): void
  +ControleerToegang(): Toegangspoging
  +SchrijfIn(): CursusInschrijving
  +PlanAfspraak(): CoachAfspraak
}
class Medewerker <<entity>> {
  -rol: String
  --
  +MaakLidAan(): Lid
  +BeheerAbonnement(): void
  +BeheerCursus(): void
  +BeheerCoach(): void
}
class Coach <<entity>> {
  -specialisatie: String
  --
  +HeeftAfspraak(moment: DateTime): bool
}
class Gebruikersaccount <<entity>> {
  -id: int
  -email: String
  -wachtwoordHash: String
  -rol: Gebruikersrol
  --
  +Inloggen(): bool
  +Uitloggen(): void
}
class Abonnement <<entity>> {
  -id: int
  -type: Abonnementstype
  -status: Status
  -startDatum: Date
  -eindDatum: Date
  -bezoekenDezeWeek: int
  -weekStart: Date
  -heeftCursusAddendum: bool
  --
  +MagNaarBinnen(): bool
  +ResetWeeklimiet(): void
  +Annuleer(): void
}
class Toegangspoging <<entity>> {
  -id: int
  -datumTijd: DateTime
  -resultaat: ResultaatToegang
  -reden: String
  -verzoekId: UUID
  --
  +Registreer(): void
}
class Cursus <<entity>> {
  -id: int
  -naam: String
  -status: Status
  --
  +VoegMomentToe(): void
  +WijzigStatus(status: Status): void
}
class CursusMoment <<entity>> {
  -id: int
  -moment: DateTime
  --
  +IsBeschikbaar(): bool
}
class CursusInschrijving <<entity>> {
  -id: int
  -inschrijfDatum: DateTime
  -status: Status
  --
  +Bevestig(): void
  +AnnuleerInschrijving(): void
}
class CoachAfspraak <<entity>> {
  -id: int
  -datumTijd: DateTime
  -status: Status
  --
  +Bevestig(): void
  +AnnuleerAfspraak(): void
}
enum Gebruikersrol {
  lid
  medewerker
  coach
  admin
}
enum Status {
  Actief
  Inactief
  Geannuleerd
  Bevestigd
}
enum Abonnementstype {
  EenKeerPerWeek
  TweeKeerPerWeek
  Onbeperkt
  CursusAddendum
}
enum ResultaatToegang {
  Toegestaan
  Geweigerd
}
Persoon <|-- Lid
Persoon <|-- Medewerker
Persoon <|-- Coach
Gebruikersaccount -- Persoon : profiel
Lid -- Abonnement : abonnement
Lid -- Toegangspoging : toegang
Lid -- CursusInschrijving : inschrijving
Lid -- CoachAfspraak : afspraak
Coach -- CoachAfspraak : begeleiding
Cursus *-- CursusMoment : momenten
CursusMoment -- CursusInschrijving : gekozen moment
Gebruikersaccount ..> Gebruikersrol : <<use>>
Persoon ..> Status : <<use>>
Abonnement ..> Abonnementstype : <<use>>
Toegangspoging ..> ResultaatToegang : <<use>>
@enduml
'''

DIAGRAMS['usecasediagram'] = r'''@startuml
left to right direction
skinparam backgroundColor white
skinparam shadowing false
skinparam defaultFontName Arial
skinparam defaultFontSize 16
skinparam usecaseBackgroundColor #F2F6FA
actor Bezoeker as B
actor Lid as L
actor Medewerker as M
actor Beheerder as A
A --|> M
rectangle "Sportschool De Kast" {
  usecase "UC-01\nRegistreren" as U1
  usecase "UC-02\nInloggen en uitloggen" as U2
  usecase "UC-03\nEigen gegevens bekijken" as U3
  usecase "UC-04\nInchecken" as U4
  usecase "Abonnement controleren" as R
  usecase "Toegangspoging opslaan" as G
  usecase "UC-05\nCursus boeken" as U5
  usecase "Cursusrecht controleren" as CR
  usecase "UC-06\nCoachafspraak plannen" as U6
  usecase "Beschikbaarheid controleren" as BR
  usecase "UC-07\nEigen boeking annuleren" as U7
  usecase "UC-08\nLeden en abonnementen beheren" as U8
  usecase "UC-09\nCursussen en coaches beheren" as U9
  usecase "UC-10\nBoekingen en toegang raadplegen" as U10
  usecase "UC-11\nRollen beheren" as U11
}
B -- U1
B -- U2
L -- U2
L -- U3
L -- U4
L -- U5
L -- U6
L -- U7
M -- U2
M -- U8
M -- U9
M -- U10
A -- U11
U4 ..> R : <<include>>
U4 ..> G : <<include>>
U5 ..> CR : <<include>>
U6 ..> BR : <<include>>
@enduml
'''

def render():
    log=[]
    alphabet=b'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'
    standard=b'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for name, source in DIAGRAMS.items():
        (ROOT/f'{name}.puml').write_text(source, encoding='utf-8')
        raw=zlib.compress(source.encode('utf-8'))[2:-4]
        encoded=base64.b64encode(raw).translate(bytes.maketrans(standard,alphabet)).decode().rstrip('=')
        base='https://www.plantuml.com/plantuml/'
        for fmt in ('svg','png'):
            url=base+fmt+'/'+encoded
            request = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=60) as response:
                data=response.read()
                if response.status!=200: raise RuntimeError(response.status)
                if fmt=='svg' and ('Syntax Error' in data.decode() or 'An error has occurred' in data.decode()):
                    raise RuntimeError('PlantUML syntax error: '+name)
                (ROOT/f'{name}.{fmt}').write_bytes(data)
        im=Image.open(ROOT/f'{name}.png')
        im.verify()
        log.append({'diagram':name,'renderedAt':datetime.now(timezone.utc).isoformat(),'sourceSHA256':hashlib.sha256(source.encode()).hexdigest(),'svg':base+'svg/'+encoded,'editor':base+'uml/'+encoded,'status':'HTTP 200; SVG zonder syntaxfout; PNG decodeerbaar'})
        print(name, Image.open(ROOT/f'{name}.png').size)
    (ROOT/'render-controle.json').write_text(json.dumps(log,ensure_ascii=False,indent=2),encoding='utf-8')

def wireframes():
    im=Image.new('RGB',(1500,1420),'white'); d=ImageDraw.Draw(im)
    fonts={n:ImageFont.truetype('C:/Windows/Fonts/arial.ttf',n) for n in (22,25,28,32,36)}
    ink='#20394B'; muted='#5B6872'; line='#A8B3BC'; fill='#F3F5F7'
    def text(x,y,s,n=25,c=ink): d.text((x,y),s,font=fonts[n],fill=c)
    def box(x,y,w,h):
        d.rounded_rectangle((x,y,x+w,y+h),radius=12,outline=line,width=2,fill='white')
        d.rectangle((x+2,y+2,x+w-2,y+60),fill=fill)
    def btn(x,y,s,w=280):
        d.rounded_rectangle((x,y,x+w,y+58),radius=7,fill=ink)
        text(x+18,y+14,s,25,'white')
    box(25,35,695,590); text(45,50,'S1  Inloggen  /login',28)
    text(60,125,'SPORTSCHOOL DE KAST',32)
    text(60,190,'E-mailadres'); d.rectangle((60,225,675,280),outline=line,width=2)
    text(60,310,'Wachtwoord'); d.rectangle((60,345,675,400),outline=line,width=2)
    btn(60,445,'Inloggen')
    text(60,535,'Foutmelding blijft bij het formulier staan.',22,muted)
    box(780,35,695,590); text(800,50,'S2  Mijn dashboard  /dashboard',28)
    text(815,125,'Mijn abonnement',32)
    text(815,190,'2x per week     |     Actief',28)
    text(815,240,'Deze week: 1 van 2 bezoeken gebruikt')
    text(815,290,'Week: ma 7 t/m zo 13 september 2026',22,muted)
    btn(815,355,'Inchecken')
    text(815,445,'Tijdens controle: knop uitgeschakeld',22,muted)
    text(815,500,'Eigen toegangshistorie    |    Uitloggen',22)
    box(25,715,695,640); text(45,730,'S3  Resultaat op dashboard',28)
    text(60,810,'TOEGANG TOEGESTAAN',32)
    text(60,865,'Je bent ingecheckt. Veel sportplezier!')
    text(60,915,'Deze week: 2 van 2 bezoeken gebruikt')
    d.line((60,985,675,985),fill=line,width=2)
    text(60,1015,'Alternatief: TOEGANG GEWEIGERD',28)
    text(60,1065,'Je weeklimiet is bereikt.',25)
    text(60,1110,'Nieuwe bezoeken vanaf maandag 14 september.',22)
    text(60,1175,'Bij storing: geen bevestigde check-in.',22,muted)
    text(60,1215,'Probeer opnieuw of meld je bij de balie.',22,muted)
    text(60,1285,'[Terug naar overzicht]   [Hulp bij de balie]',22)
    box(780,715,695,640); text(800,730,'S4  Medewerker  /dashboard',28)
    text(815,810,'Toegangspogingen',32)
    text(815,865,'Zoek lid: [lidnummer]   Datum: [vandaag]',22)
    d.rectangle((815,930,1440,986),fill=fill)
    text(830,947,'Tijd       Lid       Resultaat',25)
    text(830,1010,'10:42     1042     Toegestaan',25)
    text(830,1060,'10:45     1042     Geweigerd',25)
    text(815,1140,'Selectie: weeklimiet bereikt',25)
    btn(815,1215,'Abonnement bekijken',365)
    text(815,1295,'Alleen medewerker / beheerder',22,muted)
    d.line((730,330,764,330),fill=ink,width=4); d.polygon([(770,330),(754,320),(754,340)],fill=ink)
    im.save(ROOT/'wireframes.png')
    im=Image.new('RGB',(1500,1420),'white'); d=ImageDraw.Draw(im)
    box(25,35,695,590); text(45,50,'S5  Registreren  /register',28)
    text(60,125,'Lid worden',32)
    text(60,190,'Naam                 [                         ]')
    text(60,250,'E-mailadres        [                         ]')
    text(60,310,'Wachtwoord        [                         ]')
    text(60,370,'Abonnement        [2x per week       v]')
    btn(60,445,'Account aanmaken',320)
    text(60,535,'Privacyverklaring   |   Al een account? Log in',22)
    box(780,35,695,590); text(800,50,'S6  Cursussen  /cursussen',28)
    text(815,125,'Cursus boeken',32)
    text(815,190,'Yoga     |     Beschikbare momenten')
    text(815,250,'Moment: [10 september 18:00       v]')
    text(815,315,'Cursus-addendum: aanwezig',25)
    btn(815,390,'Boeken')
    text(815,485,'Bevestiging: je inschrijving is opgeslagen.',22)
    text(815,535,'Geen cursusrecht? Vraag het aan de balie.',22,muted)
    box(25,715,695,640); text(45,730,'S7  Coaches  /coaches',28)
    text(60,810,'Coachafspraak maken',32)
    text(60,875,'Coach: [Coach A                      v]')
    text(60,935,'Specialisatie: krachttraining')
    text(60,995,'Datum: [11 september]   Tijd: [14:00]')
    btn(60,1070,'Afspraak plannen',310)
    text(60,1170,'Dit moment is bezet. Kies een ander tijdstip.',22)
    text(60,1240,'Mijn afspraken  |  Annuleren via dashboard',22)
    box(780,715,695,640); text(800,730,'S8  Beheer  /medewerker',28)
    text(815,810,'Ledenbeheer',32)
    text(815,875,'Zoeken: [Naam of lidnummer                     ]',22)
    text(815,945,'Lid 1042     Actief     2x per week',25)
    btn(815,1010,'Abonnement aanpassen',380)
    text(815,1120,'Nieuw lid aanmaken',25)
    text(815,1180,'Cursussen beheren   |   Coaches beheren',22)
    text(815,1240,'Boekingen bekijken  |   Toegangspogingen',22)
    text(815,1295,'Alleen medewerker / beheerder',22,muted)
    im.save(ROOT/'wireframes-overig.png')

if __name__=='__main__':
    render(); wireframes()
