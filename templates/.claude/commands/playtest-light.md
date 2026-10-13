---
description: Playtest léger de {{NOM}} pour les itérations rapides : harnais, testeur fonctionnel, gardien du ton. Argument facultatif : la question ou la zone à vérifier.
argument-hint: "[question ou zone]"
---

# Playtest léger

Objet : **$ARGUMENTS** (si vide : vérifier que rien n'est cassé).

Pas de joueurs, pas de synthèse, pas de designers. **Ne JAMAIS implémenter
quoi que ce soit** : ce playtest ne modifie que `playtests/`.

1. **Harnais** : parcours partiel si l'objet désigne une zone (`--de`,
   `--a`), sinon complet, `--vitesse 2`.
   `node outils/playtest/run.mjs --etiquette light [options]`.
   Écris `question.md` dans le dossier du run.
2. Vérifie que `carnet.md` est lisible et que toutes les étapes sont « ok ».
3. Lance `testeur-fonctionnel` avec le chemin du run (et l'objet).
4. Lance `gardien-du-ton` avec le chemin du run et, s'il y a lieu, le
   changement en cours (le diff depuis la dernière version) : respecte-t-il
   la bible ?
5. Écris `decisions.md` (court) : verdict du testeur, BLOQUANTS et MAJEURS,
   avis du gardien, une case `- [ ] **Jérôme tranche** :` par point ouvert.
6. Rends compte en quelques lignes, avec un extrait du carnet.
