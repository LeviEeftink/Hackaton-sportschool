# Meewerken aan De Kast

Linear beschrijft wat we bouwen en wanneer iets geaccepteerd is. GitHub bevat de code, commits en reviews. Neem het Linear-ID op in je branch en pull request.

## Branches

| Branch                      | Functie                                             | Pull request naar                   |
| --------------------------- | --------------------------------------------------- | ----------------------------------- |
| `main`                      | Repositorybasis en later geaccepteerde opleveringen | Alleen via een release-PR bijwerken |
| `develop`                   | Integratie van het huidige sportschoolprototype     | `main`, na acceptatie               |
| `feat/hac-<id>-<onderwerp>` | Nieuwe functionaliteit                              | `develop`                           |
| `fix/hac-<id>-<onderwerp>`  | Een fout herstellen                                 | `develop`                           |
| `docs/hac-<id>-<onderwerp>` | Documentatie en ontwerpen                           | `develop`                           |
| `chore/<onderwerp>`         | Onderhoud en tooling                                | `develop`                           |

Gebruik kleine letters en koppeltekens. Eén taak per branch; begin vanaf een bijgewerkte `develop`. Maak geen blijvende branch voor iedere user story. De eerste voorbereide fixbranches bevatten nog geen oplossing.

```sh
git switch develop
git pull --ff-only
git switch -c fix/hac-24-rollen-en-profielen
# voer de wijziging uit en controleer de diff
git add src/collections/Users/index.ts
git commit -m "fix(auth): bescherm accountrollen (HAC-24)"
git push -u origin fix/hac-24-rollen-en-profielen
gh pr create --base develop
```

Bestaat de taakbranch al, gebruik dan `git switch <branchnaam>`. Commit alleen bestanden die bij de taak horen. Force-push nooit naar `main` of `develop`.

## Pull requests

Beschrijf het probleem en het nieuwe gedrag, voeg de Linear-link toe en noteer wat je hebt gecontroleerd. Gebruik een draft zolang acceptatiecriteria of relevante controles openstaan. Voeg bij zichtbare wijzigingen een screenshot met fictieve gegevens toe.

Gebruik squash-merge voor taakbranches naar `develop`. Voeg de release-PR van `develop` naar `main` met een mergecommit samen om de gedeelde geschiedenis te behouden. Verwijder afgeronde taakbranches handmatig; behoud `main` en `develop`.

De huidige private repository ondersteunt op het gebruikte GitHub-abonnement geen branch protection. Dit zijn teamafspraken, geen technisch afgedwongen blokkades. Zodra bescherming beschikbaar is: vereis PR's en geslaagde relevante checks, blokkeer force-pushes en vereis een tweede reviewer zodra er een tweede ontwikkelaar is.

## Controles

```sh
npm run check:docs
npm run lint
npm run typecheck
```

Voer relevante tests uit op een aparte database en leg resultaten vast in de PR. Bij Payload-collectionwijzigingen: genereer types opnieuw, controleer de importmap en voeg zo nodig een migratie toe. Lees `AGENTS.md` en de documentatie van de geïnstalleerde Next.js-versie voordat je frameworkcode wijzigt.

**Repository checks** controleert opmaak automatisch. **Application diagnostics** wordt handmatig gestart en rapporteert lint en TypeScript apart. De prototypecode bevat bekende fouten; een groene documentatiecheck is geen geslaagde appcontrole.

## Gegevens

Omgevingsbestanden, SQLite-bestanden, uploads, Word-lockbestanden en testresultaten horen niet in Git. Gebruik fictieve gegevens voor tests en demo's. De seedfunctie wist records en is uitsluitend bedoeld voor een wegwerpdatabase.

## Definition of Done

- De acceptatiecriteria van de Linear-taak zijn aantoonbaar gehaald.
- Relevante controles slagen, inclusief foutpaden en rechten.
- Geen geheimen, databases of echte ledengegevens in de diff.
- Documentatie, types en migraties sluiten aan op de wijziging.
- De PR bevat testbewijs en bekende beperkingen.

## Referenties

- [Next.js: ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [GitHub: workflow syntax en permissies](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Node.js: releaseplanning](https://github.com/nodejs/Release)
