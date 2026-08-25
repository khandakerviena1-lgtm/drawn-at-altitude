# Gen 04 — lancement

Deux voies. La génération coûte **12 crédits** (44 disponibles).

## Voie automatisée (je m'en occupe)

Depuis la session Claude, la chaîne complète est automatisée : serveur local
`scratchpad/frame-server.js` (en-tête Private Network Access), injection des
deux frames dans les `input[type=file]` cachés de Pikaframes, vérification
« Total 5s », lancement. Il suffit de me dire de lancer Gen 04.

Prérequis : la permission `mcp__claude-in-chrome__javascript_tool` doit être
active (elle est dans `~/.claude/settings.json`), et la fenêtre Chrome ne doit
pas être réduite — un onglet en arrière-plan garde un viewport correct, mais
une fenêtre minimisée tombe à 204×102 et les menus flottants ne se rendent
plus.

## Voie manuelle (30 secondes)

1. Chrome, onglet **pika.art** → barre du bas → Tools → **Pikaframes**.
2. Premier « Add frame » →
   `C:\Users\diana\Documents\drawn-at-altitude\source\film\gen04\start-frame.jpg`
3. Second « Add frame » →
   `C:\Users\diana\Documents\drawn-at-altitude\source\film\gen04\end-frame.jpg`
4. Coller le **Prompt** de `gen04-prompt.md` (section « Prompt (paste as-is) »),
   négatifs inclus en fin de champ — Pikaframes n'a pas de champ séparé.
5. Vérifier : **16:9 · 480p**, **Total 5 s**, coût **12 crédits**.
6. Lancer (flèche ↑). Une seule génération.

**STOP après cette génération.** Les 4 critères d'acceptation sont dans
`gen04-prompt.md`. Lisez surtout la section « Trois risques » avant de juger :
le point sensible est la **honnêteté spatiale** (le plan 03 est filmé au ras de
l'eau, la fenêtre du plan 17 est en surplomb).

Le plan de végétation qui suit ne sera **pas généré** : il existe en vrai
métrage (`_candidates/edit-target-seabuckthorn.jpg`, plan 06) et sera raccordé
au montage par occlusion, technique validée sur Gen 02.
