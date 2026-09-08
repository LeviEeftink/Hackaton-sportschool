# Roadmap en huidige stand

De [Linear-planning](https://linear.app/hackaton1levieeftink/project/sportschool-de-kast-98c7ce048137) is de bron voor taakstatus, afhankelijkheden en acceptatiecriteria. Deze pagina is een overzicht, geen tweede backlog.

## 01 — Veilige accounts en toegang

US-01 t/m US-06, US-11 en US-13: registratie, sessies, eigen gegevens, abonnementen, inchecken, uitslag, logboek en rollen.

Eerst aanpakken:

- **HAC-24:** rolwijzigingen en profielkoppelingen beschermen.
- **HAC-22:** persoonlijke abonnementen en een afgeschermde catalogus.
- **HAC-34:** seedroute afsluiten voor onbevoegden en productie.

Daarna volgen atomaire registratie, privacyregels, servervalidatie, weekreset en betrouwbare check-ins. Volg de blocking-relaties in Linear.

## 02 — Boeken en annuleren

US-07 t/m US-09: cursusmomenten boeken, coachafspraken plannen en eigen boekingen annuleren. Nodig zijn geldige toekomstige momenten, correcte rechten en bescherming tegen gelijktijdige dubbele boekingen.

## 03 — Beheer en oplevering

US-10 en US-12: medewerkers beheren leden en aanbod. Daarna volgen testbewijs, documentatie, een reproduceerbare demo en besluiten over open productvragen. US-12 is voorlopig **Should**; de overige stories zijn **Must** volgens het ontwerp.

## Technische nulmeting — 8 september 2026

- TypeScript faalt door onder meer verwijzingen naar verwijderde templatecollecties en ontbrekende gegenereerde types.
- De bestaande `next.config.ts` op `develop` gebruikt `ignoreBuildErrors: true`. Een geslaagde build bewijst daardoor niet dat TypeScript slaagt.
- ESLint is omgezet naar de native flat config van de geïnstalleerde Next.js-versie. De lintuitkomst van de app blijft apart te beoordelen.
- De frontendtest verwacht nog de Payload Website Template; de integratietest controleert alleen of users opvraagbaar zijn.
- Volledige acceptatiedekking ontbreekt. Zie **HAC-35**.

**Repository checks** valideert de opmaak van de repositorydocumentatie. **Application diagnostics** voert lint en TypeScript op aanvraag uit en verbergt fouten niet. Activeer deze als verplichte PR-checks zodra de bestaande fouten zijn opgelost en branch protection beschikbaar is.

## Nog te besluiten

**HAC-37** bundelt prioriteiten, afspraakduur/overlap bij coaches en bewaartermijnen. De 90 dagen uit het ontwerp is een onbevestigd voorstel.

Betalingen, facturatie, QR/deurkoppeling, agenda-integraties en een eigen coachdashboard vallen buiten deze versie. Er zijn nog geen releasedatum of productieclaims vastgesteld.
