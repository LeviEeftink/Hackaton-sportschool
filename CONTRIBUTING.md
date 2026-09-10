# Meewerken aan De Kast

## Branches

| Branch        | Functie                                                  | Pull request naar |
| ------------- | -------------------------------------------------------- | ----------------- |
| `main`        | Geaccepteerde opleveringen; nu nog de repositorybasis    | —                 |
| `development` | Wijzigingen samen testen; bevat het sportschoolprototype | `main`            |
| `feature`     | Nieuwe functionaliteit, fixes en ander lopend werk       | `development`     |

Gebruik deze drie vaste branches in kleine letters. Werk in kleine, samenhangende commits op `feature`:

```sh
git switch feature
git pull --ff-only
git merge origin/development
# pas bestanden aan en controleer de diff
git add <bestanden>
git commit -m "Beschrijf de wijziging"
git push
```

Open een pull request van `feature` naar `development`. Na testen en acceptatie gaat `development` via een pull request naar `main`. Gebruik mergecommits zodat de drie blijvende branches hun gedeelde geschiedenis behouden. Werk `feature` daarna bij met `origin/development`. Verwijder deze branches niet en gebruik geen force-push.

## Pull requests en controles

Beschrijf kort wat verandert, koppel de Linear-taak als die er is en vermeld je controles en bekende beperkingen. Gebruik een draft zolang het werk nog niet klaar is.

```sh
npm run check:docs
npm run lint
npm run typecheck
```

Repositoryopmaak wordt automatisch gecontroleerd op alle drie branches. Appcontroles kunnen via **Application diagnostics** handmatig worden gestart. Het prototype bevat bekende lint- en typefouten; een groene opmaakcheck betekent niet dat de app is goedgekeurd.

Voer relevante functionele tests uit op een aparte database. Genereer na Payload-collectionwijzigingen de types opnieuw en voeg zo nodig een migratie toe. Lees `AGENTS.md` voordat je code wijzigt.

## Gegevens

Commit geen geheimen, omgevingsbestanden, lokale databases, uploads of tijdelijke bestanden. Gebruik fictieve gegevens voor tests en demo's. De seedfunctie wist records en is alleen bedoeld voor een wegwerpdatabase.
