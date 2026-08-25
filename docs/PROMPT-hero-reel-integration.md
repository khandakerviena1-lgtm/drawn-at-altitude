# Prompt — intégrer `Clip3 Runaway.mp4` comme fond du hero

Prompt autonome, à coller tel quel dans un agent de code. Il encode les quatre bugs rencontrés lors de la première intégration ; sans eux l'agent les reproduit.

---

## Contexte

Tu travailles sur `C:\Users\diana\Documents\drawn-at-altitude`, une landing page éditoriale immersive pour **Drawn at Altitude** — une immersion de neuf jours en carnet de voyage au Ladakh, septembre 2027, animée par Anastasiia Morozova (Natura Illustrata), produite par India-Khan.

Stack : Next.js 16 (Turbopack), TypeScript, `motion/react` 13, Lenis pour le scroll. Pas de dépôt git.

**Lis d'abord** `docs/MASTER-BUILD-SPEC.md`, `docs/MOTION-SYSTEM.md` et `docs/ASSET-MANIFEST.md`. Les milestones ont des stop-gates : ne construis rien au-delà de la tâche décrite ici.

## L'asset

`C:\Users\diana\Downloads\À trier\À trier\Clip3 Runaway.mp4` — 6,92 s, 720×1280, 24 fps, muet, 10,8 Mo.

Contenu : un carnet de croquis tenu devant la fenêtre d'une chambre, le dessin y répond au paysage réel ; le carnet redescend ; la caméra traverse la chambre, franchit la fenêtre et finit dehors sur la rivière et les peupliers.

**C'est une vidéo entièrement générée par IA représentant un établissement réel (The Indus River Camp).** Rien de ce qu'on y voit n'existe. Elle est autorisée comme placeholder de démonstration uniquement. Catalogue-la `PLACEHOLDER (AI-generated video)` dans `ASSET-MANIFEST.md`, avec interdiction explicite de la publier comme footage du camp.

## La tâche

Aujourd'hui le hero fait : ligne graphite → le carnet arrive → la couverture s'ouvre → une vidéo de l'Indus est **dans** la page → la caméra entre dedans jusqu'au plein cadre.

Remplace la fin de cette chorégraphie par :

1. La couverture s'ouvre sur **du papier**, portant le contour dessiné à la scène 00 (`CONTOUR_PRIMARY` / `CONTOUR_CONSTRUCTION` de `components/sketch/paths.ts`). Un carnet contient une page, pas un écran — et la ligne que le visiteur vient de voir naître est maintenant dedans. Supprime la vidéo Indus de la page.
2. **Zoom** sur cette page dessinée, puis un **hold** au point le plus proche, papier plein cadre.
3. **Dezoom** : le carnet recule, et le clip est révélé derrière lui comme fond de la page.

Contraintes de mise en œuvre :

- Le clip tourne **déjà** derrière avant que le dezoom ne commence. Il doit être découvert par la levée d'un voile ivoire (`var(--paper)`), jamais démarré au moment de la révélation — sinon on voit la vidéo « s'allumer » et le procédé se trahit.
- Au retour, pousse le `translateZ` en **négatif** (≈ −300) plutôt que de le ramener à 0 : le carnet doit **reculer**, pas simplement retrouver sa taille.
- Réencode le clip avant de le servir : à 10,8 Mo il met en danger le budget LCP ≤ 2,5 s dès la première image. Vise ~3 Mo (`libx264`, crf 27, `-movflags +faststart`, `-an`). ffmpeg est installé mais **pas dans le PATH** — appelle-le par son chemin absolu sous `%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg_*\ffmpeg-*\bin\`.
- Génère une poster image et sers-la aussi comme image fixe en `prefers-reduced-motion`.
- La source est en 9:16 : en desktop le recadrage plein cadre coupe le carnet filmé en bas. **C'est acceptable et voulu** — à ce moment le visiteur regarde *notre* carnet en CSS, le clip n'est que le lieu derrière. Sur téléphone il tombe nativement.

## Pièges à ne pas reproduire

Ces quatre-là ont coûté du temps la première fois. Ils sont documentés dans `MOTION-SYSTEM.md` — respecte-les.

1. **Ne passe jamais un `useTransform(scrollProgress, …)` brut à `style`.** Motion 13 promeut ces cas en Web Animations natives dont le mapping de timeline est non fiable avec un `useScroll` ciblé sur conteneur : les éléments se figent sur des valeurs périmées. Utilise `useScrollMapped` / `useScrollComputed` de `lib/animation/useScrollMapped.ts`.
2. **Mesure avec `offsetWidth` / `offsetHeight`, jamais `getBoundingClientRect()`.** Le rect renvoie la boîte *déjà transformée* : un `resize` déclenché en plein travelling mesure la page agrandie, fait tomber l'échelle cible sous 1 et **inverse toute la poussée**. Plancher l'échelle à 1.
3. **Lis la `perspective` sur l'élément, ne la code pas en dur.** Le breakpoint mobile la redéfinit à 1200px ; une profondeur calculée contre la mauvaise valeur passe le plan caméra et fait exploser la projection à des centaines de milliers de pixels.
4. **Sous `transform-style: preserve-3d`, l'ordre de peinture vient de la position Z réelle, pas de `z-index`.** Échelle de profondeur du carnet : ombre portée −18 · contact −6 · plat 0 · feuilles 0–7 · page 8 · charnière 10 · couverture 12. Sans ça, la page passe **devant la couverture fermée** et on voit son contenu alors que le carnet doit être clos.

À savoir aussi : l'échelle nécessaire pour couvrir le viewport se calcule depuis les distances à l'**origine de perspective** (`perspective-origin: 50% 42%`), pas depuis le centre du viewport — un simple `max(vw/w, vh/h)` laisse un liseré de papier non couvert en haut. Et ne mets aucun `transform` en CSS sur `.tiltWrap` : Motion y écrit `rotateX`/`rotateY` et reconstruit la chaîne complète, donc toute translation déclarée en CSS est silencieusement écrasée.

## Vérification

`npx tsc --noEmit` doit passer et la console rester vide.

Puis vérifie **visuellement** aux cinq temps : couverture fermée, page dessinée révélée, zoom au plus près, dezoom avec le clip qui monte, arrivée.

Le breakpoint mobile est à **809px** — un pane de navigateur étroit applique donc les règles mobiles sans prévenir. Teste à une vraie largeur desktop (≥ 1200px) *et* en 375×812.

Attention enfin : si la fenêtre du navigateur n'est pas au premier plan, `requestAnimationFrame` ne tourne pas. Motion et Lenis sont alors gelés et `window.innerHeight` peut valoir 0 — tout paraît cassé alors que rien ne l'est. Vérifie `document.visibilityState` avant de conclure à un bug.

## Critères d'acceptation

- Le carnet s'ouvre sur du papier portant le contour, plus aucune vidéo dans la page.
- Le clip est déjà en lecture quand le voile se lève.
- En fin de séquence il remplit le viewport sur les quatre bords, en desktop comme en mobile.
- Le fichier servi pèse ~3 Mo, avec `faststart`.
- `prefers-reduced-motion` rend une composition fixe équivalente, sans mouvement.
- `ASSET-MANIFEST.md` et `MOTION-SYSTEM.md` sont mis à jour, le clip marqué placeholder généré, et les fichiers `v01-hero-indus-landscape*` marqués inutilisés sans être supprimés (c'est de la vraie footage du camp, candidate évidente si le clip généré est abandonné).
