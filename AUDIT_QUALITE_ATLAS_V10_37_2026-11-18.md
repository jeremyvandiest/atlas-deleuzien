# Atlas — Audit qualité éditoriale, documentaire et ergonomique
**Date :** 18 novembre 2026 · **Livraison corrective :** V10.37 · **Dépôt :** jeremyvandiest/atlas-deleuzien

## Objet et niveau de preuve
Cet audit distingue quatre états : présence de données, contrôle statique des liens, vérification ponctuelle de sources externes et validation humaine de la lecture. Les trois premiers sont partiellement couverts ici. **Aucun parcours sur téléphone ou navigateur réel n'est attesté ; aucune certification philologique intégrale n'est revendiquée.**

Version avant correction conservée sur la branche `archive/atlas-v10-36-avant-audit-20261118`. Les cartes, les 30 dossiers et les partitions préexistants n'ont pas été réécrits par cette livraison.

## 1. Atlas 1 — la philosophie selon Deleuze
- **147/147** guides individualisés : 107 auteurs, 23 œuvres, 10 routes, 7 interludes.
- Chaque guide contient `lead`, `scene`, `mechanism`, `deeper`, `limit` ; les champs vérifiés ne comportent pas de texte intégral dupliqué.
- **311** liens d'approfondissement vers d'autres guides ; tous correspondent à des identifiants existants dans le jeu de 147 guides.
- Longueur moyenne des cinq champs : **environ 120 mots** (minimum 96, maximum 178). Ce sont des **introductions**, pas l'équivalent des dossiers de 2 000 mots d'Atlas 2.
- **Non encore prouvé :** que chaque reconstruction de Deleuze soit exacte au regard des éditions primaires ; que chaque exemple soit le meilleur possible ; que les cartes longues compensent systématiquement la brièveté de l'introduction.
- **Protocole éditorial restant :** pour chacune des 147 entrées, vérifier l'exemple, le problème de l'auteur, la manière propre dont Deleuze le reconfigure, un passage primaire localisé, un contrepoint critique et le lien vers la carte longue. Déclarer séparément « vérifié sur texte », « recoupé par source secondaire », « orientation en attente ».

## 2. Atlas 2 — cartographie des œuvres
- **30/30** dossiers détectés, dont les deux pilotes Kafka et *Jeanne Dielman*.
- Longueur moyenne brute des contenus HTML : **environ 2 333 mots** ; moyenne descriptive, pas note de qualité.
- **269/269** notices contextualisées ont un titre d'ancrage retrouvé dans le HTML de leur dossier.
- **26** dossiers déclarés « parité éditoriale », **2** pilotes, **2** dossiers de statut « documentaire provisoire » : *Bugonia* et *L'Accident de piano*.
- Les réserves documentaires ne doivent pas être invisibilisées par la formule « 30/30 » : *En attendant Godot* conserve, dans son propre texte, une « canonisation encore suspendue » et une demande de contrôle d'édition.
- *Bugonia* : le synopsis AFI confirme les personnages, l'enlèvement et la situation initiale ; la *Science Fiction Encyclopedia* (mise à jour du 9 novembre 2026) décrit le dénouement. Reste à confronter découpage, montage et forme à la copie du film.
- *L'Accident de piano* : la notice du distributeur Diaphana confirme Magalie, Patrick, le retrait à la montagne et le chantage d'une journaliste. Le montage, les vidéos et le dénouement ne sont pas certifiés par ce synopsis.
- **Règle restante :** pour chaque dossier, distinguer faits de l'œuvre, propositions d'interprétation, appui documentaire, ce que la construction formelle rend perceptible, et limite de lecture.

## 3. Atlas 3 — Le Théâtre du sentir
- **15** chapitres, **7** scènes, **21** partitions, **18** études d'écoles et de formes, **5** approches complémentaires et **4** enquêtes transversales dans V1.6.1.
- Les 4 enquêtes organisent **16 étapes** vers chapitres, Salon ou approches. Ces chemins possèdent des cibles dans les données et les types de pages du lecteur.
- La revue de portée IFS 2025 retient **27 études** ; l'essai randomisé PARTS publié en 2026 porte sur **60 personnes**, 30 par groupe, avec comparaison active. **Ne pas confondre** plausibilité clinique, preuve de supériorité sur le critère principal et pertinence artistique des analogies.
- Les traditions Stanislavski, Michael Chekhov, Meisner, Lecoq et autres doivent garder leurs démarches distinctes. Les partitions d'Atlas 3 sont des créations originales, **pas** des exercices authentifiés de ces écoles ; elles n'imposent ni émotion, ni introspection, ni souvenir traumatique.
- **Contrôles manquants :** collation des ouvrages-source des écoles, validité des références secondaires, essais réels des partitions avec des participants volontaires, retours d'observation et situations de refus.

## 4. Esthétique utilitaire commune — correction V10.37
**Principe :** un même vocabulaire d'interface, trois usages intellectuels distincts. Titres en Georgia, aides et commandes en system-ui, fonds papier, texte bleu-gris, accent discret, blocs ouverts plutôt que tableaux de bord surchargés. La logique pédagogique « découvrir / comprendre / approfondir » est commune, sans uniformiser les contenus.

Corrections minimales appliquées :
1. Les en-têtes du Salon et des enquêtes d'Atlas 3 affichent désormais dynamiquement la version de l'édition active, et non une ancienne mention V1.5.
2. Les liens de lecture des trois Atlas convergent vers un traitement sobre, des cibles tactiles minimales de 40 px (44 px en mobile) et un focus clavier visible.
3. Les cartes d'entrée des trois Atlas retrouvent une indication de focus claire.
4. Nouveau cache de PWA V10.37 pour recharger les fichiers modifiés. Les corpus antérieurs et les lecteurs restent préservés.

## 5. Parcours de recette à réaliser sur appareils réels
- **Accueil :** franchir les trois portes puis revenir, sans perte de position, sur ordinateur et téléphone.
- **Atlas 1 :** ouvrir Hume, Kant, une œuvre, une route et un interlude ; développer les niveaux et cliquer sur les liens ; vérifier un retour simple et la lisibilité du texte long.
- **Atlas 2 :** parcourir Kafka, *Jeanne Dielman*, *Godot*, *Bugonia* et *L'Accident de piano* ; vérifier table des matières, notices, filtres, références et absence de rubriques redondantes.
- **Atlas 3 :** parcourir un chapitre par partie, les sept scènes, une approche IFS, la bibliothèque des écoles et les quatre enquêtes ; contrôler 21 partitions et l'ouverture/fermeture des notions.
- **Ergonomie :** à 320, 375 et 768 px puis desktop, tester tailles, débordements horizontaux, clavier seul, retour précédent, contraste, toucher, focus, cache actualisé et liens externes.

## 6. Références vérifiées ponctuellement
- IFS scoping review (2025) : https://doi.org/10.1080/13284207.2025.2533127
- PARTS RCT (2026), PubMed : https://pubmed.ncbi.nlm.nih.gov/41609644/
- *Bugonia*, AFI FEST : https://fest.afi.com/2025/special-screenings-2025/bugonia/
- *Bugonia*, *The Encyclopedia of Science Fiction* : https://sf-encyclopedia.com/entry/bugonia
- *L'Accident de piano*, Diaphana : https://diaphana.fr/film/laccident-de-piano/

**Verdict :** parité **architecturale** vérifiable et premiers garde-fous documentaires confirmés. **Excellence éditoriale pièce par pièce et usage mobile non certifiés à ce stade.** La prochaine opération n'est pas d'ajouter des fonctions : elle consiste à lever ces réserves méthodiquement.
