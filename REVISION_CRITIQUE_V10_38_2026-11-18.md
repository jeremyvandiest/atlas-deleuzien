# Atlas — révision critique V10.38
18 novembre 2026 — branche publiée `main`

## Verdict
Trois Atlas pédagogiquement structurés et corpus conservés. Cette livraison **n'est pas** une certification intégrale des 147 interprétations philosophiques, des 30 œuvres ni des 18 traditions théâtrales, et **n'atteste pas** d'essais sur appareils réels. La distinction entre vérification statique, recoupement documentaire ponctuel et expertise éditoriale reste obligatoire.

## Tests reproductibles sur les données
| Contrôle | Résultat sur les fichiers publiés |
|---|---|
| Atlas 1 — entrées | 147 guides (107 auteurs, 23 œuvres, 10 routes, 7 interludes) ; 311 liens internes sans cible manquante |
| Atlas 1 — introductions | 5 champs par guide ; aucun champ manquant ni doublon intégral constaté |
| Atlas 2 — dossiers V4.3 | 30 dossiers ; deux pilotes ; 269 notices contextualisées dont tous les titres d'ancrage sont présents |
| Atlas 2 — statuts documentaires | 2 œuvres marquées PROVISIONAL dans le catalogue : *Bugonia*, *L'Accident de piano* ; des réserves éditoriales détaillées restent dans d'autres dossiers |
| Atlas 3 — éditions | V1.6.2 (mise à jour documentaire de V1.6.1) ; 15 chapitres, 7 scènes, 21 partitions, 18 formes/traditions, 5 approches, 4 enquêtes |
| Atlas 3 — notions | 30 notions, 2 par chapitre, toutes reliées à des sections existantes de leur propre chapitre |
| Atlas 3 — documentation | 18 notices bibliographiques référencées par 18 dossiers de formes ; pas de référence de forme absente |
| Atlas 3 — routes | 33 étapes cumulées dans les 4 parcours et 4 enquêtes ; toutes les cibles représentées dans les données et les types de pages sont reconnues |
| Code modifié | Contrôle syntaxique JavaScript réussi pour les deux lecteurs et les données modifiées |

Les contrôles statiques ne prouvent pas qu'un clic réussit sur un navigateur donné ni qu'une interprétation est fidèle au texte primaire.

## Corrections appliquées
1. **Atlas 1** : retrait d'une analogie IFS inutile dans l'entrée T. E. Lawrence ; limite désormais strictement littéraire, autobiographique et philosophique. Les 147 cartes existantes sont conservées.
2. **Atlas 2** : dans les dialogues de notions, les touches Tab, Maj+Tab et Échap préservent une navigation clavier cohérente ; la fermeture rend le focus au déclencheur lorsque celui-ci existe encore.
3. **Atlas 3** : le plafonnement des insertions de notions est désormais commun aux sections d'un même chapitre (jusqu'à trois occurrences par notion, et non par section). Les fiches restent accessibles depuis la boussole du chapitre, même sans correspondance lexicale directe dans le texte. Ajout d'alias précis pour certains passages sur l'attention, l'offre d'improvisation, les actes de parole et la fiction.
4. **Atlas 3** : même traitement du focus dans les dialogues de notions que dans Atlas 2.
5. **Atlas 3** : précision historique sur la provenance de « théâtre pauvre » (Ludwik Flaszen, puis théorisation par Grotowski) à partir de la notice de l'Institut Grotowski ; le texte hébergé sur Spolin.com est désormais déclaré ressource secondaire, pas extrait primaire de Spolin. Édition documentaire V1.6.2.
6. **PWA** : cache V10.38 pour intégrer les nouvelles versions des lecteurs, des guides et de l'édition théâtrale.
7. **Préservation** : archivage de la V10.37 sur `archive/atlas-v10-37-avant-revision-finale`. Aucun composant de lecture n'a été reconstruit.

## Contrôle documentaire ciblé, avec degrés de preuve
**Atlas 1.** Les dossiers Hume, Kant, Nietzsche, Platon, Spinoza, Bergson et d'autres entrées majeures ont été examinés comme exemples de progression. Les présentations sont compatibles avec les repères critiques de la *Stanford Encyclopedia of Philosophy* et de l'*Internet Encyclopedia of Philosophy* au niveau des grandes distinctions. Ce recoupement secondaire ne garantit pas chaque citation, ni les interprétations fines de 147 cartes.

- https://plato.stanford.edu/entries/deleuze/
- https://iep.utm.edu/gilles-deleuze/

**Atlas 2.** *En attendant Godot* : le renversement Pozzo/Lucky entre les actes, la venue reportée du garçon et l'absence de mouvement final sont recoupés par des notices d'édition et des sources critiques. La comparaison des variantes d'édition et des didascalies nécessite toujours une édition de référence. *Bugonia* : les sources AFI et *Science Fiction Encyclopedia* soutiennent le cadre factuel et le dénouement, mais ne remplacent pas une vision de la copie entière. *L'Accident de piano* : Diaphana confirme le cadre, pas la structure complète du montage.
- https://search.worldcat.org/fr/title/En-attendant-Godot/oclc/15873829
- https://fest.afi.com/2025/special-screenings-2025/bugonia/
- https://sf-encyclopedia.com/entry/bugonia
- https://diaphana.fr/film/laccident-de-piano/

**Atlas 3.** La forme Grotowski est révisée sur la notice historique de l'Institut ; la ressource d'improvisation hébergée par Spolin.com est requalifiée. La présentation IFS reste distincte d'une pratique scénique et prend en compte la revue de 2025 (27 études) et l'essai PARTS de 2026 (N=60) sans promettre une efficacité supérieure à la comparaison active.
- https://grotowski.net/en/encyclopedia/poor-theatre
- https://spolin.com/?page_id=627
- https://pubmed.ncbi.nlm.nih.gov/41609644/

## Charte esthétique et ergonomique
Conserver une même typographie de lecture (Georgia), une typographie fonctionnelle de navigation (system-ui), les fonds clairs et les contrastes sobres déjà présents. Favoriser le texte et l'espace disponible ; ne pas produire une forêt de contrôles ou de comparaisons forcées. Les notions ouvrent une compréhension et un approfondissement, sans interrompre le fil du chapitre.

## Ce qui reste hors du périmètre certifié
- Collation intégrale **de chaque** entrée contre les textes primaires de Deleuze et les œuvres convoquées.
- Visionnage, écoute, lecture intégrale et vérification des éditions/versionnements de **chaque** œuvre d'Atlas 2, particulièrement les deux films marqués provisoires.
- Vérification intégrale des sources d'**au moins une œuvre primaire pour chacune** des 18 traditions / formes de l'Atlas 3 ; essai de terrain des 21 partitions.
- Test du site déployé, du cache PWA, du clavier, du tactile et de la mise en page sur téléphone et ordinateur réels : **non exécuté dans cette passe**.

**Décision éditoriale :** ne pas ajouter de fonctions. Les prochaines corrections doivent découler d'une erreur vérifiée sur source ou d'un défaut constaté en usage réel. Les acquis ne sont pas à réécrire.
