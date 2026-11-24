# Audit Atlas 3 — 24 novembre 2026

Base V10.51 ; candidate V10.52 / Atlas 3 V1.6.10.

## Contrôles effectués
- Inventaire complet des 16 dossiers longs, présence des termes déclarés, comparaison des rubriques et statuts. Quatre termes manquaient au texte ; ajoutés en contexte. Déduplication des URL dans chaque bibliographie. Bibliographies externes : contrôle ciblé Gendlin (bibliothèque de l'Institut, articles et notices), Winnicott (pagination Tavistock 1971 confirmée par Oxford, plusieurs notices non rouvertes), Chekhov (notices Windsor 5 et 29 décembre 1941), Brook, Spolin, Grotowski, Boal, Brecht et Overlie (textes ou notices repérés). Ce n'est pas une vérification exhaustive du contenu ou de la disponibilité de chaque lien, ni des 82 entrées de la cartographie.
- Gendlin : rétablissement de la cosignature de Grindler et McGuire. Ansa : table des matières du PDF, 29 chapitres, ISBN et passages p. 392–393. Winnicott : distinction entre références contrôlées et accès non confirmé.
- Défaut du lecteur : une seule notion pouvait être rendue cliquable par nœud de texte ; une occurrence non autonome pouvait aussi masquer une occurrence valide suivante. Nouveau segmentateur : occurrences autonomes, priorité aux expressions longues à position égale, plusieurs liens par paragraphe, maximum deux occurrences par terme, texte préservé. Quatre tests unitaires de segmentation réussis avant publication. Tests de navigation et fenêtres effectués ensuite sur le commit candidat. Pas de validation visuelle iPhone ni de DOM navigateur réel.
- 29 entrées du cache, y compris la racine, correspondent aux fichiers du dépôt. Index HTML de 1,9 Mo non renvoyé en texte par le connecteur ; pas d'audit complet de l'index ou des Atlas 1/2.
- Approfondissement V2 de Brecht et Overlie/Bogart/Landau. Les six autres dossiers de deuxième salve demeurent V1. La longueur ne constitue pas un critère suffisant de fondation.

## Inventaire
| Dossier | Mots approximatifs | Notions |
|---|---:|---:|
| stanislavski | 4470 | 6 |
| meisner | 2611 | 6 |
| lecoq | 5266 | 6 |
| e01 | 2745 | 5 |
| mchekhov | 3039 | 12 |
| gendlin | 4941 | 16 |
| winnicott | 5402 | 15 |
| ansa | 2414 | 8 |
| brook | 1370 | 7 |
| grotowski | 1272 | 6 |
| brecht | 1828 | 7 |
| boal | 1368 | 6 |
| strasberg | 1226 | 6 |
| spolin | 1153 | 6 |
| johnstone | 1271 | 6 |
| viewpoints | 1758 | 9 |

## Prochaine action
Conserver le programme : approfondir les six V1 restants, puis intégrer Meyerhold, Adler, Knebel, Barba, Suzuki, Gaulier et les pédagogies de la voix. Feldenkrais et les approches du sentir restent inscrits dans la phase suivante. Aucun ajout de menu.
