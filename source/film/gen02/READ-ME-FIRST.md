# Gen 02 — ce qu'il reste à faire à la main (30 secondes)

Même procédure que Gen 01 : seul le choix des deux fichiers exige une main
humaine (Chrome n'ouvre pas son sélecteur de fichiers pour un automate, et
c'est une protection voulue).

1. Dans Chrome, onglet **pika.art** — panneau **Pikaframes**
   (sinon : barre du bas → Tools → Pikaframes).
2. Premier « Add frame » → choisir
   `C:\Users\diana\Documents\drawn-at-altitude\source\film\gen02\start-frame.jpg`
3. Second « Add frame » → choisir
   `C:\Users\diana\Documents\drawn-at-altitude\source\film\gen02\end-frame.jpg`
4. Dans « Describe your transition », coller le **Prompt** de
   `gen02-prompt.md` (section « Prompt (paste as-is) »).
5. Vérifier : **16:9 · 480p**, **5s**, coût **12 crédits** (68 disponibles).
6. Lancer (flèche ↑). Une seule génération.
7. Quand le rendu est prêt : le télécharger dans ce dossier sous
   `gen02-take1.mp4` — ou me dire simplement « c'est prêt » et je m'occupe
   de la récupération, de la planche-contact et du dossier de review.

**Règle du brief : STOP après cette génération.** L'approbation (les 4
critères dans `gen02-prompt.md`) est humaine.

⚠️ Avant de lancer, lisez la section **« Trois risques »** de
`gen02-prompt.md`. Le principal : la frame finale de Gen 01 est un plan
large, donc Gen 02 doit parcourir paysage → roche → minéral → abstrait →
textile en 5 s, là où le brief n'autorise qu'une ou deux transformations.
Si le rendu paraît précipité, la bonne réponse est de **scinder ce passage
en deux générations**, pas de re-prompter plus fort.

Le dossier `_candidates/` conserve les frames examinées pour choisir la
frame de fin (planches-contact du métrage textile, frames pleine taille à
43,70 / 44,30 / 44,45 s) et la queue de Gen 01 take 1.
