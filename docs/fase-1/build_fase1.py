from document_helpers import *
from docx.enum.section import WD_SECTION_START, WD_ORIENT

def landscape():
    s=doc.add_section(WD_SECTION_START.NEW_PAGE)
    s.orientation=WD_ORIENT.LANDSCAPE
    s.page_width=Inches(11.69); s.page_height=Inches(8.27)
    s.top_margin=s.bottom_margin=Inches(.55)
    s.left_margin=s.right_margin=Inches(.6)
    return s

def portrait():
    s=doc.add_section(WD_SECTION_START.NEW_PAGE)
    s.orientation=WD_ORIENT.PORTRAIT
    s.page_width=Inches(8.5); s.page_height=Inches(11)
    s.top_margin=s.bottom_margin=s.left_margin=s.right_margin=Inches(1)
    return s

p('Fase 1','Title')
p('Ontwerp van Sportschool De Kast','Subtitle')
label('Werkproces:','B1-K1-W2 - Ontwerpt software')
label('Naam student:','.............................................................')
label('Klas:','...............................................................................')
label('Datum:','7 september 2026')
label('Versie:','1.0 - ter beoordeling')
h('1. Aanleiding en doel')
p('Sportschool De Kast heeft een website nodig waarmee leden zelf hun sportzaken kunnen regelen. Een lid moet een account kunnen maken, zijn abonnement kunnen bekijken, kunnen inchecken en een cursus of coachafspraak kunnen boeken. Medewerkers moeten de gegevens kunnen beheren en vragen van leden kunnen beantwoorden.')
p('Dit document beschrijft het ontwerp van deze onderdelen. Het bevat de user stories, de werking van de schermen, een klassendiagram, een usecasediagram en een activiteitendiagram. Ook worden de ontwerpkeuzes, beveiliging en omgang met persoonsgegevens uitgelegd.')
sub('Wat hoort bij het ontwerp?')
table(['Onderdeel','Functies'],[
['Account','Registreren, inloggen, uitloggen en eigen gegevens bekijken.'],
['Abonnement en toegang','Abonnement koppelen, weeklimiet controleren, inchecken en toegangspogingen bewaren.'],
['Cursussen','Cursussen en momenten bekijken, boeken en annuleren.'],
['Coaches','Coaches bekijken, een afspraak plannen en annuleren.'],
['Beheer','Leden, abonnementen, cursussen, coaches en boekingen beheren.'],
],[2650,6710])
p('Het inchecken is verder uitgewerkt in het activiteitendiagram. Betalingen, e-mailberichten, een agenda-koppeling en het openen van een echte toegangspoort vallen buiten deze versie.')
p('Het ontwerp is gebaseerd op het bestaande project en Documentatie_De_Kast.docx. Punten die nog gebouwd of aangepast moeten worden, staan bij de ontwerpcontrole.','Small')

page('2. User stories en eisen')
p('De eisen FE-01 tot en met FE-08 komen uit de bestaande projectdocumentatie. Hieronder zijn ze uitgewerkt als user stories. Must betekent nodig voor de basisversie; Should betekent gewenst na de basisfuncties. De opdrachtgever moet de prioriteiten nog bevestigen.')
STORIES=[
['US-01','Als bezoeker wil ik een account maken, zodat ik lid kan worden.','FE-01','Must'],
['US-02','Als gebruiker wil ik in- en uitloggen, zodat mijn account beschermd is.','FE-02','Must'],
['US-03','Als lid wil ik mijn eigen abonnement, bezoeken en boekingen zien.','FE-03','Must'],
['US-04','Als lid wil ik inchecken volgens de regels van mijn abonnement.','FE-04','Must'],
['US-05','Als lid wil ik zien of ik toegang krijg en wat de reden is.','FE-04','Must'],
['US-06','Als medewerker wil ik toegangspogingen terugvinden om een vraag van een lid te beantwoorden.','FE-08','Must'],
['US-07','Als lid wil ik een cursusmoment boeken als ik cursusrecht heb.','FE-05','Must'],
['US-08','Als lid wil ik een beschikbaar moment bij een coach boeken.','FE-06','Must'],
['US-09','Als lid wil ik mijn eigen cursus of coachafspraak annuleren.','FE-03*','Must'],
['US-10','Als medewerker wil ik leden aanmaken en hun gegevens beheren.','FE-07','Must'],
['US-11','Als medewerker wil ik abonnementen koppelen, wijzigen en annuleren.','FE-07','Must'],
['US-12','Als medewerker wil ik cursussen, cursusmomenten en coaches beheren.','FE-07','Should'],
['US-13','Als beheerder wil ik rollen beheren, zodat iedere gebruiker de juiste rechten heeft.','FE-07*','Must'],
]
table(['ID','User story','Eis','Prioriteit'],STORIES,[900,6300,900,1260])
p('* US-09 is ook gebaseerd op de annuleerfunctie in het project. US-13 werkt het rollenbeheer verder uit. Deze twee stories maken de oorspronkelijke eisen concreter.','Small')

page('3. Functioneel ontwerp')
sub('Registreren en inloggen')
p('Een bezoeker vult naam, e-mailadres en wachtwoord in en kiest een abonnementstype. De server controleert de invoer en of het e-mailadres al bestaat. Daarna worden een persoonlijk abonnement, een lidprofiel en een account samen opgeslagen. Als een stap mislukt, wordt niets definitief aangemaakt. Na registratie kan het lid inloggen. Een verkeerde combinatie van e-mailadres en wachtwoord geeft een algemene foutmelding.')
sub('Abonnement bekijken en inchecken')
p('Het dashboard toont het abonnementstype, de status en het aantal gebruikte bezoeken in de huidige week. Het lid kiest Inchecken. De server controleert de rechten en slaat de uitkomst op. Bij toegang wordt de teller met één verhoogd. Bij een weigering blijft de teller gelijk en wordt de reden getoond. De volledige beslisregels staan in hoofdstuk 4.')
sub('Een cursus boeken')
p('Het lid kiest een actieve cursus en een aangeboden moment in de toekomst. De server controleert het eigen lidprofiel, de geldigheid van het abonnement en het cursus-addendum. Een tweede bevestigde inschrijving voor hetzelfde lid, dezelfde cursus en hetzelfde moment wordt geweigerd. Bij een geldige aanvraag wordt de inschrijving bevestigd en verschijnt deze op het dashboard.')
sub('Een coachafspraak plannen')
p('Het lid kiest een actieve coach en een toekomstig tijdstip. De server controleert of er voor die coach op dat tijdstip al een bevestigde afspraak bestaat. Is het moment bezet, dan kiest het lid een ander moment. Anders wordt de afspraak opgeslagen. Voor deze versie betekent een dubbele boeking: dezelfde coach op exact hetzelfde tijdstip. Een afspraakduur en controle op overlappende tijdvakken moeten nog met de opdrachtgever worden afgesproken.')
sub('Een boeking annuleren')
p('Een lid kan op het dashboard een eigen cursusinschrijving of coachafspraak annuleren. De server controleert het eigenaarschap en zet de status op Geannuleerd. Het lid mag via deze actie geen ander lid, cursus, coach of tijdstip invullen. De boeking blijft zichtbaar met de nieuwe status. Een annulering verandert de fitnessbezoekenteller niet.')
sub('Beheer door medewerkers')
p('Actieve medewerkers kunnen leden aanmaken, gegevens aanpassen en persoonlijke abonnementen koppelen of beëindigen. Zij beheren ook cursussen, momenten en coaches. Boekingen en toegangspogingen zijn beschikbaar voor ondersteuning aan de balie. Alleen de beheerder mag accountrollen wijzigen. Een coach heeft in deze versie een profiel; een eigen coachdashboard wordt nog niet gebouwd.')

page('4. Regels voor abonnement en toegang')
p('Voor inchecken moet het lid ingelogd zijn en aan een eigen lidprofiel zijn gekoppeld. Een verlopen sessie leidt terug naar het inlogscherm. Zonder lidprofiel verschijnt een melding om contact op te nemen met de balie.')
table(['Situatie','Beslissing'],[
['Lid of abonnement niet actief','Toegang geweigerd. Alleen status Actief geeft toegang.'],
['Geen abonnement gekoppeld','Toegang geweigerd: geen abonnement gevonden.'],
['Buiten de looptijd','Toegang geweigerd. Startdatum is inclusief; einddatum is exclusief. Een lege einddatum betekent geen vastgelegde einddatum.'],
['EenKeerPerWeek','Eerste bezoek van de week toegestaan; volgende bezoeken geweigerd.'],
['TweeKeerPerWeek','Eerste twee bezoeken toegestaan; volgende bezoeken geweigerd.'],
['Onbeperkt','Toegang toegestaan zonder weekmaximum. De teller wordt wel bijgewerkt.'],
['CursusAddendum als type','Geen recht op gewone fitnessbezoeken. De aparte addendum-vlag bepaalt het cursusrecht.'],
['Nieuwe week','De week loopt van maandag 00:00 tot de volgende maandag 00:00, volgens Europe/Amsterdam. De teller begint opnieuw bij nul.'],
['Herhaald verzoek','Hetzelfde verzoekId geeft dezelfde uitkomst terug en telt niet opnieuw.'],
['Opslagfout','Alle wijzigingen worden teruggedraaid. Het scherm meldt een storing en bevestigt geen toegang.'],
],[2650,6710])
sub('Voorbeeld')
p('Een lid heeft een abonnement voor twee bezoeken per week en heeft al één keer gesport. De volgende check-in wordt toegestaan; de teller wordt twee. Een nieuwe poging in dezelfde week wordt geweigerd. Vanaf maandag begint een nieuwe week.')
p('De weekgrens, de exclusieve einddatum en de betekenis van CursusAddendum moeten nog worden bevestigd door de opdrachtgever. Deze regels zijn in het hele ontwerp hetzelfde gebruikt.','Small')

landscape()
h('5. Klassendiagram')
figure('klassendiagram.png',height=5.85,caption='Figuur 1. Klassendiagram van Sportschool De Kast. De groene kop geeft de klassenaam aan; daaronder staan eigenschappen en methoden.')
portrait()
h('5.1 Uitleg bij het klassendiagram')
p('Persoon bevat de gegevens die een lid, medewerker en coach gemeen hebben: id, naam, e-mailadres en status. Deze drie klassen erven van Persoon. De open driehoek wijst naar Persoon. De overige pijlen tonen de relaties, met een korte beschrijving zoals heeft, plant of begeleidt. Een minteken staat voor een afgeschermde eigenschap; een plusteken voor een openbare methode.')
p('Een account is apart gehouden van het profiel. Het account bevat de gegevens voor het inloggen en de gebruikersrol. Daardoor staan de toegangsrechten los van bijvoorbeeld het abonnement van een lid of de specialisatie van een coach.')
table(['Relatie','Betekenis'],[
['Account - Persoon','Een account heeft maximaal één profiel. Een lidaccount moet aan een lidprofiel zijn gekoppeld.'],
['Lid - Abonnement','Een lid heeft maximaal één persoonlijk abonnement. Een abonnement wordt niet gedeeld door meerdere leden.'],
['Lid - Toegangspoging','Een lid kan meerdere toegangspogingen hebben. Iedere poging hoort bij één lid.'],
['Cursus - CursusMoment','Een cursus bevat meerdere momenten. De gevulde ruit geeft aan dat het moment onderdeel van de cursus is.'],
['Lid - CursusInschrijving - Moment','Een inschrijving koppelt één lid aan één cursusmoment. De cursus is via dat moment bekend.'],
['Lid - CoachAfspraak - Coach','Een afspraak hoort bij één lid en één coach. Beiden kunnen meerdere afspraken hebben.'],
],[3650,5710])
sub('Vaste waarden')
table(['Type','Waarden'],[
['Status','Actief, Inactief, Geannuleerd, Bevestigd'],
['Abonnementstype','EenKeerPerWeek, TweeKeerPerWeek, Onbeperkt, CursusAddendum'],
['ResultaatToegang','Toegestaan, Geweigerd'],
['Gebruikersrol','lid, medewerker, coach, admin'],
],[2650,6710])
p('Het diagram is het ontwerp van het domein. In Payload zijn leden, medewerkers en coaches aparte collecties. Persoon is dus een gedeeld begrip in het ontwerp. CursusMoment staat nu als een lijst binnen Cursussen; inschrijvingen bewaren nu cursus en moment. Het ontwerp gebruikt hiervoor een vaste relatie. weekStart en verzoekId moeten nog worden toegevoegd.','Small')

page('6. Usecasediagram')
p('Dit diagram laat zien wie welke functies kan gebruiken. De actoren staan buiten het systeem; de functies staan binnen de rechthoek.')
figure('usecasediagram.png',height=6.65,caption='Figuur 2. Usecasediagram van de volledige applicatie.')
p('Een beheerder heeft ook de rechten van een medewerker. «include» betekent dat een controle altijd bij de genoemde actie hoort. Een coach is een boekbaar profiel en heeft in deze versie geen eigen werkproces op de website.','Small')

page('7. Wireframes: inloggen en inchecken')
p('De schermschetsen tonen de indeling en de belangrijkste knoppen. Foutmeldingen blijven op het scherm staan. Bij een lopende aanvraag is de knop tijdelijk uitgeschakeld.')
figure('wireframes.png',width=6.5,caption='Figuur 3. Inloggen, dashboard, uitslag van een check-in en toegangsoverzicht voor medewerkers.')
p('S1 → S2: inloggen als lid. S2 → S3: inchecken. S3 → S2: terug naar het overzicht. Een medewerker komt na het inloggen bij S4. Uitloggen leidt terug naar S1.')
p('Het resultaat wordt in tekst getoond, met kleur als ondersteuning. Een lid kan bij een weigering of storing hulp vragen bij de balie. Een medewerker kan de bijbehorende toegangspoging opzoeken.','Small')

page('7.1 Wireframes: boeken en beheren')
figure('wireframes-overig.png',width=6.5,caption='Figuur 4. Registratie, cursus boeken, coachafspraak plannen en ledenbeheer.')
p('S5 → S1: na registratie naar inloggen. Vanuit S2 opent het lid S6 voor cursussen of S7 voor coaches. Een bevestigde boeking verschijnt op het dashboard, waar het lid die ook kan annuleren.')
p('Vanuit S4 opent de medewerker S8. Daar kan een lid worden opgezocht en kan het abonnement worden aangepast. Cursussen en coaches worden in de beheeromgeving onderhouden.')
p('Deze schetsen zijn het schermontwerp. Zoekfilters en enkele meldingen moeten nog worden toegevoegd. De namen en lidnummers in de voorbeelden zijn fictief. De schermen krijgen duidelijke veldlabels, zichtbare toetsenbordfocus en statusmeldingen die een schermlezer kan voorlezen.','Small')

page('8. Activiteitendiagram: inchecken')
p('Voor de start controleert de server de sessie en het eigen lidprofiel. Dit diagram begint bij een nieuw check-inverzoek. Een eerder verwerkt verzoekId geeft de opgeslagen uitkomst terug.','Small')
figure('activiteitendiagram.png',height=6.4,caption='Figuur 5. UML-activiteitendiagram van het inchecken, gemaakt met PlantUML.')
p('De banen laten zien wat het lid en de server doen. De ruiten zijn beslissingen. Geldig betekent dat lidstatus, abonnementstatus en looptijd kloppen. Het maximum volgt uit hoofdstuk 4. De stappen moeten achter elkaar worden uitgevoerd; parallelle verwerking is hier niet nodig.','Small')

page('9. Ontwerpkeuzes')
sub('Aansluiten op het bestaande project')
p('Next.js en Payload zijn al aanwezig in het project. Payload verzorgt accounts, collecties, de API en de beheeromgeving. Dat scheelt het bouwen van een apart beheersysteem. De sportschoolregels kunnen op één plek op de server worden gecontroleerd. TypeScript helpt om fouten in velden en relaties eerder te vinden.')
sub('Relaties en aparte registraties')
p('Leden, abonnementen, cursussen en afspraken worden apart opgeslagen en via relaties gekoppeld. Hierdoor hoeft dezelfde informatie niet steeds te worden overgenomen. Inschrijvingen, afspraken en toegangspogingen krijgen een eigen status of resultaat, zodat een medewerker later kan terugvinden wat er is gebeurd.')
sub('Een persoonlijke teller')
p('Ieder lid krijgt een eigen abonnementrecord. Een gedeeld record zou ervoor zorgen dat leden dezelfde bezoekenteller gebruiken. weekStart legt vast bij welke week de teller hoort. De teller wordt bij de eerste aanvraag van een nieuwe week opnieuw ingesteld.')
sub('Veilig opslaan')
p('Een check-in werkt de teller en het logboek samen bij. Beide wijzigingen moeten slagen; anders wordt alles teruggedraaid. De combinatie lid en verzoekId is uniek. Bij twee gelijktijdige aanvragen met nog één bezoek over mag er maar één slagen. Ook registratie en het vastleggen van boekingen moeten dubbele of half opgeslagen gegevens voorkomen.')
sub('Duidelijke schermen')
p('Het dashboard laat direct zien welk abonnement iemand heeft en hoeveel bezoeken er zijn gebruikt. Een check-in geeft een blijvende uitslag met een reden. Het lid hoeft daardoor niet te raden waarom een aanvraag is geweigerd. Cursussen, afspraken en beheer hebben elk hun eigen scherm.')
sub('Wat nog aangepast moet worden')
p('De huidige code moet op enkele punten worden aangescherpt: persoonlijke abonnementskoppelingen afdwingen, weekStart en verzoekId toevoegen, status en looptijd controleren en het toegangsresultaat altijd op de server bepalen. De huidige check-in mag een door de gebruiker meegestuurd resultaat niet overnemen.')
p('Ook moeten rol- en veldrechten worden beperkt, geneste databasehandelingen dezelfde transactie gebruiken en boekingen op actieve profielen en geldige toekomstige momenten worden gecontroleerd. Voor annuleren moet iedere serveractie het eigenaarschap controleren. Dit document beschrijft deze verbeteringen; ze zijn nog niet allemaal gebouwd.')

page('10. Privacy, ethiek en veiligheid')
sub('Privacy')
p('De applicatie bewaart naam, e-mailadres, accountgegevens, abonnement, boekingen en toegangspogingen. Voor deze functies zijn geen medische gegevens, biometrie of locatiegegevens nodig. Bezoekmomenten worden alleen gebruikt voor toegangscontrole en het beantwoorden van vragen over bezoeken.')
p('Een lid ziet alleen zijn eigen gegevens. Medewerkers krijgen toegang voor hun werkzaamheden. Een openbare lijst met abonnementen toont alleen de beschikbare typen; persoonlijke abonnementsgegevens en bezoekentellers zijn niet openbaar. Op een openbaar coachprofiel staan alleen gegevens die voor het kiezen van een coach nodig zijn.')
p('De opdrachtgever moet het doel, de grondslag en de bewaartermijn vastleggen. De privacyverklaring legt uit wat wordt bewaard en hoe een lid inzage, correctie of verwijdering kan aanvragen. Voor noodzakelijke gegevens van het lidmaatschap wordt uitvoering van de overeenkomst als grondslag beoordeeld. Aanvullende logging krijgt een afzonderlijke beoordeling. [B1]')
p('Voorstel: toegangspogingen na 90 dagen verwijderen, tenzij een vastgelegd doel langer bewaren nodig maakt. Dit is een voorstel, geen wettelijke termijn. Voor accounts, boekingen en back-ups moeten ook bewaartermijnen worden afgesproken. Er is geen intern privacyprotocol aangeleverd; de leidinggevende moet dit nog controleren. [B1]')
sub('Ethiek')
p('De toegang hangt af van het abonnement, de geldigheid en het aantal bezoeken. Persoonlijke kenmerken spelen geen rol. Een weigering krijgt een duidelijke reden en het lid kan om hulp vragen. Bij een systeemstoring wordt geen onjuiste overtreding aan het lid toegeschreven. De interface moet ook met een toetsenbord en schermlezer bruikbaar zijn.')
sub('Veiligheid')
p('Wachtwoorden worden gehasht opgeslagen. De website gebruikt HTTPS en passende beveiligde sessiecookies. Inlogpogingen en check-inverzoeken worden begrensd. De server controleert de sessie, de rol en het eigenaarschap bij iedere aanvraag. Een lid mag geen rol, lidkoppeling, abonnement of toegangsresultaat aanpassen.')
p('Bij Payload-handelingen namens een gebruiker worden user en overrideAccess: false gebruikt. Interne updates met extra rechten zijn alleen toegestaan na een controle en binnen dezelfde transactie; daarvoor moet req worden doorgegeven. Foutmeldingen tonen geen databasegegevens of geheimen. [B2]')
p('Alleen de beheerder wijzigt rollen. Beheerwijzigingen worden controleerbaar vastgelegd. Een herstelprocedure en beveiligde back-ups beperken gegevensverlies. Demo-accounts en een route die de database vult of wist mogen niet beschikbaar blijven in de productieomgeving.')

page('11. Controle van het ontwerp')
p('Per story staat hieronder hoe wordt gecontroleerd of de functie aan de eis voldoet. Dit zijn de acceptatiecriteria voor de bouw- en testfase; de controles zijn voor dit document niet als applicatietest uitgevoerd.')
table(['Story','Ontwerp','Acceptatiecriterium'],[
['US-01','S5 / UC-01','Geldige registratie maakt één account en lid aan. Bestaand e-mailadres of opslagfout maakt geen halve registratie.'],
['US-02','S1 / UC-02','Verkeerde login geeft geen toegang. Na uitloggen zijn eigen gegevens niet meer op te vragen.'],
['US-03','S2 / UC-03','Lid A kan de gegevens of boekingen van lid B niet lezen of wijzigen.'],
['US-04','§4 / figuur 5','Bij 1x per week wordt de tweede check-in geweigerd; bij 2x de derde. Onbeperkt blijft toegestaan.'],
['US-05','S3','Resultaat en reden blijven zichtbaar. Een opslagfout geeft geen toegangsbevestiging.'],
['US-06','S4 / UC-10','Een verwerkte poging heeft lid, tijdstip, resultaat en reden. Een replay maakt geen tweede poging.'],
['US-07','S6 / UC-05','Alleen met geldig cursusrecht en aangeboden moment boeken. Een dubbele inschrijving wordt geweigerd.'],
['US-08','S7 / UC-06','Twee bevestigde afspraken voor dezelfde coach op hetzelfde tijdstip zijn niet mogelijk.'],
['US-09','UC-07','Alleen eigen boeking annuleren. Andere gegevens van de boeking blijven gelijk.'],
['US-10/11','S8 / UC-08','Actieve medewerker kan een lid en persoonlijk abonnement beheren. Een lid kan dit niet.'],
['US-12','UC-09','Medewerker kan cursussen, momenten en coaches beheren; een lid niet.'],
['US-13','UC-11','Alleen de beheerder kan rollen wijzigen. Een lid kan zichzelf geen extra rechten geven.'],
],[1140,1500,6720])
p('Extra controles: een nieuwe week, ontbrekend abonnement, toekomstige startdatum, einddatum vandaag, inactief lid, CursusAddendum en gelijktijdige aanvragen met één resterend bezoek.','Small')

page('12. Feedback en akkoord')
p('De leidinggevende bespreekt het ontwerp en vult hieronder het besluit in. Er is nog geen akkoord ontvangen.')
label('Naam leidinggevende:','................................................................')
label('Functie:','................................................................................')
label('Datum bespreking:','...................................................................')
sub('Bespreekpunten')
p('Sluiten de functies en prioriteiten aan bij de wensen van de sportschool? Zijn de weekgrens, de einddatum en het cursus-addendum juist uitgewerkt? Welke afspraakduur geldt voor coaches? Zijn de rollen, bewaartermijnen en beveiligingsmaatregelen akkoord?')
sub('Feedback')
for _ in range(4):p('..............................................................................................................')
sub('Besluit')
p('Akkoord / akkoord na aanpassingen / niet akkoord')
p('Doorhalen wat niet van toepassing is.')
label('Afgesproken aanpassingen:','')
for _ in range(2):p('..............................................................................................................')
label('Verwerkt in versie en datum:','........................................................')
label('Handtekening of verwijzing naar schriftelijk akkoord:','')
p('..............................................................................................................')

page('13. Bronnen en diagramcontrole')
sub('Projectbestanden')
p('Documentatie_De_Kast.docx, versie 1.0 van 1 september 2026, bevat de functionele eisen FE-01 tot en met FE-08. Verder zijn de onderstaande bronbestanden gebruikt.')
for text in ['src/collections/Users/index.ts - accounts en rollen', 'src/collections/Leden.ts en Abonnementen.ts - leden en abonnementen', 'src/collections/Toegangspogingen.ts - inchecken en logging', 'src/collections/Cursussen.ts en CursusInschrijvingen.ts - cursussen en boekingen', 'src/collections/Coaches.ts en CoachAfspraken.ts - coaches en afspraken', 'src/collections/Medewerkers.ts - medewerkergegevens', 'src/app/(frontend)/ - registratie, login, dashboard, cursussen, coaches en beheer', 'src/payload.config.ts - CMS- en databaseconfiguratie']:
    p(text,'Small')
sub('Naslag')
link('[B1] AVG, Verordening (EU) 2016/679 - artikelen 5, 6, 12-22, 25 en 32','https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng')
link('[B2] Payload - Local API en toegangscontrole','https://payloadcms.com/docs/local-api/overview')
link('PlantUML - klassendiagrammen','https://plantuml.com/class-diagram')
link('PlantUML - usecasediagrammen','https://plantuml.com/use-case-diagram')
link('PlantUML - activiteitendiagrammen','https://plantuml.com/activity-diagram-beta')
sub('Controle van de diagrammen')
p('Het klassendiagram, usecasediagram en activiteitendiagram zijn gerenderd op de officiële PlantUML-server. De server gaf voor alle schema’s geldige SVG- en PNG-afbeeldingen terug, zonder syntaxfouten. De afbeeldingen zijn daarna gecontroleerd op leesbaarheid, lijnen en labels.')
logs=json.loads((ROOT/'render-controle.json').read_text(encoding='utf-8'))
for row in logs:link('Open '+row['diagram']+' in PlantUML',row['editor'])
p('De volledige PlantUML-code staat in de bijlagen. Voor de gegevenslaag is het klassendiagram gekozen. Daarmee is voldaan aan de keuze voor een ERD óf een klassendiagram.','Small')

for idx,name in enumerate(['klassendiagram','usecasediagram','activiteitendiagram']):
    page(f'Bijlage {chr(65+idx)} - {name.capitalize()}')
    p('PlantUML-code van het diagram.','Small')
    lines=(ROOT/f'{name}.puml').read_text(encoding='utf-8').splitlines()
    for line in lines:p(line,'Code')

doc.core_properties.subject='B1-K1-W2 - Ontwerp Sportschool De Kast'
doc.save(OUT)
print(OUT)
print('Figuren:',len(doc.inline_shapes),'Tabellen:',len(doc.tables))
