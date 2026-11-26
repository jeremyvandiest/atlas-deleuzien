# Audit comparatif Jung : application V1.6.21 → candidat V2
26 novembre 2026. Atlas 3 exclusivement. Comparaison documentaire et structurelle du code de la branche main, pas test visuel de la version déployée. Référence : [atlas3-v15.js](../atlas3-v15.js), blob 562e3946b5c2a3a40b2a95015f926d13d474ea59, approche id jung. Candidat : [jung-dossier-fondateur-candidat-v2.json](jung-dossier-fondateur-candidat-v2.json), blob e567546fef1c72be3d9f1e479d56423d842bfda9. Registre : [jung-cw07-registre-couverture-v1.md](jung-cw07-registre-couverture-v1.md), 853 paragraphes numérotés selon relevés précédents. Pas de nouvelle lecture exhaustive indépendante de ces 853 paragraphes.

## Résultat vérifiable
| Critère | Ancienne approche (code main) | Candidat V2 |
|---|---|---|
| Présentation | introduction, question, principe, exemple, contre-exemple, limite | mêmes champs, huit modules structurés par problème |
| Lexique | 41 notions, sept catégories | 62 notions, huit catégories |
| Notions conservées | — | 41/41, dont 8 réécrites et 33 conservées textuellement |
| Nouvelles notices | — | 21 |
| Cartes | aucune dans l'objet approche Jung ni dans son rendu actuel | 9 structures de cartes (nœuds, relations, disposition), pas encore rendues |
| Pratique | un exemple central et des renvois vers des scènes et chapitres | huit propositions originales de travail de fiction, plus les renvois d'origine |
| Sources | extraits primaires ciblés et lexiques secondaires ; statut explicite | registre élargi, ancrages CW par module et ajouts ; références individuelles des anciennes notices encore à contrôler |
| Écrans | approche en trois niveaux + notices repliables dans atlas3-reader.js | candidat indépendant, intégration non réalisée |

## Ce qui était déjà réussi et doit être conservé
L'ancien dossier distinguait clairement moi et Soi, archétype et image archétypique, anima/animus et stéréotypes sexués, signe et symbole, fonction de sentiment et émotion, ainsi que les limites de la synchronicité et des interprétations de rêves. L'ancien dossier ne proposait pas de typage simpliste des personnes et gardait une distance avec l'IFS. Il possédait déjà une distinction persona/complexe, des passages de liaison avec les chapitres 05 et 06 et un renvoi vers l'imaginaire au chapitre 09. Le nouveau dossier ne doit pas remplacer ces acquis par une vulgate jungienne.

## Différences qualitatives
- **Genèse** : le désaccord Freud/Adler et la réponse méthodologique de Jung deviennent le point de départ. Avant, le lecteur rencontrait les définitions sans leur problème fondateur. La distinction causalité/finalité et les méthodes réductive/constructive ont désormais une place explicite.
- **Dynamique** : la compensation n'est plus présentée principalement comme contrepoids ; elle comprend la complémentarité. Autorégulation, unilatéralité et énantiodromie permettent de distinguer les mécanismes. Vérification directe CW 7 §§ 114–116, 274–275.
- **Différenciation** : l'ancien lexique contenait l'inflation et l'identification, mais pas la personnalité mana. Celle-ci reçoit une notice et une place dans le chapitre sur les rôles et la relation, conformément au dernier chapitre du deuxième essai. Vérification directe CW 7 §§ 388–398. Le transfert et l'imago sont maintenant nommés.
- **Transformation** : l'ancienne définition de la fonction transcendante était juste mais sommaire et sa référence était une présentation institutionnelle secondaire. Le candidat articule formulation créatrice et compréhension, puis prise de position du moi (CW 8 §§ 172–193, § 177 recontrôlé). Le modèle ne constitue pas un protocole thérapeutique pour le lecteur.
- **Individuation** : expliciter la dimension collective et les impasses de la différenciation ; vérifier directement CW 7 §§ 266–269. La totalité excède le moi ; pas d'objectif de connaissance complète (CW 7 § 274). Les variantes de 1916 sont signalées, non fusionnées.
- **Expérience et symboles** : distinguer vécu et vérification, analyser le rôle du contexte de création, intégrer la renaissance et distinguer les cadres artistique, spirituel et clinique. Les 24 planches n'ayant pas été examinées, ne pas revendiquer une analyse visuelle achevée.

## Comparatif des 8 notices modifiées
### Soi
Ancienne : Totalité psychique excédant le moi conscient ; distincte du Self dans l'IFS.

Candidate : Totalité hypothétique de la psyché consciente et inconsciente, excédant le moi ; Jung la figure également comme centre de totalité. Le moi ne peut en acquérir une connaissance complète. La définition de 1916 diffère de celle du texte remanié.

Ancrage : CW 7 §§ 274, 398–405, 511–521.

### Persona
Ancienne : Chez Jung, formation de compromis entre l'individu et les attentes sociales. La façon singulière de l'habiter importe aussi ; elle ne résume pas la psyché.

Candidate : Formation de compromis et fonction d'adaptation entre sujet et attentes collectives. Le problème n'est pas l'existence du rôle mais l'identification qui le fait passer pour toute la personnalité.

Ancrage : CW 7 §§ 243–247, 269, 305–311.

### Compensation
Ancienne : Dans la théorie jungienne, fonction par laquelle des processus inconscients peuvent contrebalancer l’orientation unilatérale de la conscience, sans que toute réaction soit automatiquement compensatoire.

Candidate : Relation postulée entre les processus inconscients et l'attitude consciente ; elle peut la compléter, la nuancer ou la contrebalancer, sans être nécessairement son contraire.

Ancrage : CW 7 §§ 274–275, 114–116.

### Inflation
Ancienne : Extension démesurée du sentiment de soi par identification à une position ou à un contenu qui dépasse le moi. Notion jungienne, non diagnostic de grandeur à partir d’une seule conduite.

Candidate : Extension excessive du sentiment de soi par appropriation de contenus ou de prestige dépassant le moi ; peut aussi se jouer dans une relation d'autorité. La personnalité mana est un développement spécifique de cette question.

Ancrage : CW 7 §§ 221–242, 374–398.

### Archétype
Ancienne : Disposition formelle hypothétique organisant certains motifs de l’expérience et de l’imagination. À distinguer des représentations concrètes dans lesquelles elle s’exprime ; ce n’est pas un personnage hérité déjà dessiné.

Candidate : Hypothèse de disposition formelle transpersonnelle, distincte des images particulières produites et élaborées dans un contexte. Les analogies entre motifs ne démontrent pas une transmission héréditaire.

Ancrage : CW 7 §§ 101–109 ; CW 9i §§ 525–626.

### Individuation
Ancienne : Chez Jung, processus de différenciation et de transformation des rapports entre conscient et inconscient, distinct de l'individualisme et de l'identification à une persona ou une image intérieure.

Candidate : Processus de différenciation et de transformation du rapport entre moi, inconscient et monde collectif ; ne se confond ni avec individualisme ni avec une maîtrise totale de la psyché.

Ancrage : CW 7 §§ 266–269, 274, 398–406.

### Fonction transcendante
Ancienne : Processus de confrontation entre conscient et inconscient susceptible d'ouvrir une orientation nouvelle.

Candidate : Processus de relation entre positions consciente et inconsciente pouvant faire émerger une attitude nouvelle ; la formulation créatrice et la compréhension se complètent, puis le moi prend position. Ni compromis mécanique ni promesse de résolution.

Ancrage : CW 8 §§ 131–193, surtout 177–193.

### Imagination active
Ancienne : Méthode historique de confrontation consciente avec des images, affects ou figures spontanées, qui peuvent recevoir une forme expressive. Elle ne se réduit ni à la rêverie ni à une visualisation dirigée. Dans Atlas 3, étude conceptuelle, non protocole clinique autonome.

Candidate : Méthode jungienne de confrontation consciente à des images ou affects spontanés, avec mise en forme, compréhension et réponse du moi ; distincte de la rêverie et de la création artistique. Étudiée ici comme méthode historique, non protocole autonome.

Ancrage : CW 8 §§ 166–193 ; CW 9i §§ 617–626.

## 21 ajouts réellement absents du lexique de référence
- **Éros** — Orientation vers le lien et le désir, dont Jung discute la primauté dans la lecture freudienne ; ne pas en faire une explication unique. (CW 7 §§ 16–34, 42–55).
- **Volonté de puissance** — Dans la confrontation avec Adler, orientation vers la maîtrise ou la sécurité du moi ; distincte de l'ensemble de la philosophie de Nietzsche. (CW 7 §§ 35–55).
- **Méthode réductive** — Remonter d'une formation psychique à ses conditions et à son histoire ; utile sans épuiser sa portée. (CW 7 §§ 65–70, 121–132).
- **Méthode constructive** — Examiner ce que les formations psychiques rendent possible au-delà d'une explication par leurs antécédents. (CW 7 §§ 121–140 ; CW 8 §§ 147–151).
- **Finalité psychique** — Orientation prospective postulée de certains processus, sans plan conscient ou destin prédéterminé. (CW 7 §§ 65–70, 290–292).
- **Affect** — Dimension éprouvée et chargée d'une situation ou d'un contenu ; à distinguer de la fonction de sentiment comme jugement de valeur. (CW 7 §§ 19–28 ; CW 8 §§ 166–171).
- **Autorégulation** — Modèle de relations compensatoires entre processus psychiques, dont Jung suppose qu'ils participent à l'ajustement de la totalité. (CW 7 §§ 274–275).
- **Unilatéralité** — Prédominance d'une orientation au détriment d'autres possibilités, sans que toute spécialisation soit pathologique. (CW 7 §§ 78–96, 114–116).
- **Énantiodromie** — Renversement d'une orientation vers son contraire lorsqu'elle devient excessivement dominante ; ne pas confondre avec toute compensation. (CW 7 §§ 110–116).
- **Imago** — Configuration subjective d'une personne ou relation, façonnée par l'expérience et les attentes ; distincte de cette personne réelle. (CW 7 §§ 293–301).
- **Transfert** — Déplacement et actualisation de contenus relationnels dans une relation présente, notamment analytique ; ne pas réduire toute relation à un transfert. (CW 7 §§ 93–100, 206–209).
- **Personnalité mana** — Figure de puissance et de savoir exceptionnel à laquelle le moi peut s'identifier ; cas particulier d'inflation, avec une dimension collective et relationnelle. (CW 7 §§ 374–398, en particulier 388–393).
- **Personnification** — Présentation d'un contenu ou d'une fonction psychique sous une figure personnelle ; ne démontre pas qu'une entité extérieure existe. (CW 7 §§ 312–317, 336–340, 392).
- **Différenciation** — Reconnaître la différence entre le moi et une fonction, un rôle, un contenu ou une autre personne, tout en maintenant la possibilité d'une relation. (CW 7 §§ 266–269, 341–373).
- **Niveau objectif et niveau subjectif** — Deux angles d'interprétation : rapport de l'image à un objet ou une personne extérieure, et rapport aux dimensions psychiques du sujet. Aucun niveau ne permet d'inférer à lui seul des faits. (CW 7 §§ 128–132).
- **Réalité psychique** — Statut de l'expérience psychique en tant qu'elle est vécue et agit ; distinct de l'établissement de la réalité extérieure de son objet. (CW 7 §§ 151–158, 351–359 ; CW 18 §§ 785–789).
- **Individualisme** — Mise en avant de la singularité au détriment des obligations collectives, dont Jung distingue explicitement l'individuation. (CW 7 §§ 266–269).
- **Adaptation** — Ajustement aux conditions de la vie extérieure et intérieure ; une adaptation réussie dans un seul domaine peut laisser d'autres exigences sans réponse. (CW 7 §§ 250–259, 318–323).
- **Renaissance** — Famille d'expériences et d'idées de renouvellement, de transformation ou de participation rituelle que Jung distingue selon leur nature. (CW 9i §§ 199–258).
- **Transformation psychique** — Modification du rapport aux contenus, attitudes et possibilités d'action ; distincte d'une émotion intense ou de la répétition d'une forme rituelle. (CW 9i §§ 206–239 ; CW 8 §§ 172–193).
- **Suggestion** — Influence des attentes et des indications sur la perception, le récit ou l'action, à considérer dans l'examen des expériences rapportées. (CW 18 §§ 697–706, 727–740).

## Contrôle de non-régression exhaustif sur les noms du lexique
- Psyché : définition conservée.
- Conscience : définition conservée.
- Moi : définition conservée.
- Inconscient personnel : définition conservée.
- Inconscient collectif : définition conservée.
- Soi : définition enrichie.
- Persona : définition enrichie.
- Complexe : définition conservée.
- Constellation : définition conservée.
- Libido : définition conservée.
- Compensation : définition enrichie.
- Projection : définition conservée.
- Identification : définition conservée.
- Inflation : définition enrichie.
- Ombre : définition conservée.
- Archétype : définition enrichie.
- Image archétypique : définition conservée.
- Anima : définition conservée.
- Animus : définition conservée.
- Syzygie : définition conservée.
- Individuation : définition enrichie.
- Opposés psychiques : définition conservée.
- Fonction transcendante : définition enrichie.
- Intégration : définition conservée.
- Symbole vivant : définition conservée.
- Signe : définition conservée.
- Rêve : définition conservée.
- Imagination active : définition enrichie.
- Amplification : définition conservée.
- Mandala : définition conservée.
- Introversion : définition conservée.
- Extraversion : définition conservée.
- Pensée : définition conservée.
- Sentiment : définition conservée.
- Sensation : définition conservée.
- Intuition : définition conservée.
- Fonction inférieure : définition conservée.
- Synchronicité : définition conservée.
- Alchimie psychologique : définition conservée.
- Conjonction des opposés (coniunctio) : définition conservée.
- Numineux : définition conservée.

## Prochaines validations avant publication
Le candidat est une reconstruction éditoriale fondée sur le registre et des relectures ciblées, pas une validation exhaustive des sources. Ne pas déduire l'absence d'une notion de toute l'application de son absence dans ce lexique : certains concepts peuvent figurer dans des chapitres ou d'autres fichiers. Comparer les dossiers transversaux et le code du lecteur avant déploiement. L'approche publique doit privilégier les huit modules, donner accès au lexique complet sans imposer la lecture de 62 fiches et afficher les cartes au point exact du problème. Les neuf cartes sont des propositions structurées, non des images ni des interactions testées. Le lecteur actuel n'affiche pas ces champs : intégrer un rendu spécifique, tester les ancres, la navigation, l'accessibilité et la lisibilité mobile. Garder le contenu de main intact avant validation ; ne pas modifier Atlas 1, 2 ou 4. 
Les textes de CW 6 (types et fonctions), CW 8 (complexes, énergie, synchronicité), CW 9ii (Aïon : ombre, syzygie, Soi) et les textes alchimiques ne sont pas déclarés intégralement lus. Les notices liées sont conservées, à consolider par lectures primaires. Compléter collation française, notes, contrôle OCR et planches. Élargir seulement sur justification de la couverture d'auteur. 
## Conclusion
Le nouveau dossier améliore la structure argumentative et les articulations conceptuelles sans sacrifier les acquis. Il est objectivement plus étendu ; la qualité finale et la couverture complète ne seront attestées qu'après validation des ancrages et test du lecteur. L'ancienne version reste une référence de concision et de prudence.
