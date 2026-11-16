# Atlas V10.16 — Cartographie argumentée des œuvres

## Objet
La mise à jour enrichit **Atlas 2**, sans modifier les œuvres canoniques ni les sept Routes verrouillées.

### Chaque fiche d’œuvre
- Présentation en prose « En quelques mots » conservée.
- Nouvelle section « Comment les éléments s’articulent » : trois entrées choisies dans les **sections existantes** du dossier. Chaque entrée renvoie au passage complet plus bas.
- Nouvelle section « Comparer sans confondre » : liens distincts vers les Routes canoniques et propositions de comparaisons éditoriales, accompagnées de justifications et des deux sections sources.
- Les raccords canoniques et le corpus approfondi restent intacts.

### Carte des connexions
- Nouvelle page **Connexions** dans la navigation d’Atlas 2.
- **26 comparaisons éditoriales proposées**, dont 24 sur des œuvres dont les dossiers ne sont pas provisoires et deux expressément présentées comme pistes provisoires (Bugonia, L’Accident de piano).
- Chaque comparaison indique le mécanisme rapproché ou contrasté, les œuvres, la justification narrative et les rubriques des fiches sur lesquelles elle repose.
- Filtres par œuvre et statut, sans suggestion fondée sur la seule présence d’un mot-clé commun.

## Frontières intellectuelles
La comparaison éditoriale reste une **lecture argumentée et discutable**, et ne vaut pas validation historique ni identité de mécanismes. Elle ne se substitue pas aux Routes éditoriales déjà verrouillées, aux sources primaires ni à la lecture des œuvres.

## QA locale
- 30 fiches rendues dans un environnement DOM simulé ; chacune possède 3 articulations, un accès aux comparaisons et à ses passages.
- 90 ancrages internes contrôlés ; 52 références de sections vérifiées pour les 26 comparaisons ; toutes les 30 œuvres couvertes.
- Filtres des 26 liens, des 24 liens non provisoires et des 2 pistes provisoires validés.
- Audit canonique Atlas 2 : **417 passes, 0 avertissement, 0 erreur**.
- Syntaxe des fichiers JS validée.
- Le navigateur Chromium local ne termine pas son lancement dans cet environnement. Vérification graphique réelle à effectuer sur GitHub Pages/iPhone.

## Compatibilité
`index.html`, `atlas2.js`, `atlas2.css` et `service-worker.js` modifiés ; nouveau fichier `atlas2-relations.js`. Pas de changement des scripts et données canoniques Atlas 1 / Atlas 2 / Atelier / ŒUVRE, des icônes ou d’Atlas 3.

## Retour arrière
Avant fusion : créer une branche de sauvegarde `backup/v10-15-avant-cartographie`.
