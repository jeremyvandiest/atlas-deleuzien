# Atlas — paquet GitHub V10.14 sans connexion IA (15 novembre 2026)

**Source** : archive canonique `Atlas_APP_v10_14_30_Oeuvres.zip` du 24 août 2026.
**Philosophie** : identité du code principal Atlas 1 vérifiée par comparaison avec `Atlas_Deleuzien_APP_v8_Foucault.zip` ; le seul dossier substantiellement refondu est Foucault. Son module V8 « Trois questions, une seule pratique de pensée » et les trois dimensions de l’espace de l’énoncé, abrégés en V10.14, ont été réintégrés.
**Atlas 2** : 30 œuvres, 10 transformations ; Bugonia et L’Accident de piano restent provisoires.
**Atelier** : six étapes manuelles, pré-routage déterministe, tests, export et ŒUVRE maintenus. Connexion à un moteur IA (configuration serveur, appels distants, rapport IA, scripts LLM, backend) retirée du paquet de publication.
**Code IA original** : conservé dans l'archive source V10.14 ; pas détruit.

## Versionnement et publication

- **Sauvegarde** : branche GitHub `backup/v4-2026-11-15`, qui préserve exactement l’état original de la V4 avant toute migration.
- **Branche de préparation** : `migration/v10-14-sans-connexion-ia`.
- **Publication** : fusion dans `main` uniquement après vérification des fichiers et des validations.
- **Accès** : https://jeremyvandiest.github.io/atlas-deleuzien/ (GitHub Pages, même URL).
- **Vérifications manuelles** : accueil, Auteurs/Œuvres/Concepts, Foucault, Atlas 2 (30 œuvres), Atelier (six étapes sans panneau IA), ŒUVRE, mise à jour PWA sur iPhone.
- **Retour arrière** : restaurer `main` à partir de la branche de sauvegarde V4 si la publication présente un problème.

La validation syntaxique et les contrôles de cohérence du code ne remplacent pas les essais réels dans un navigateur après mise en ligne.
