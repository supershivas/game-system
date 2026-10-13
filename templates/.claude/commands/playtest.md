---
description: Playtest complet de {{NOM}} par l'équipe d'agents (harnais, testeurs, joueurs, synthèse, designers, gardien du ton). Argument : la question de la version.
argument-hint: "<question, ex. Le premier niveau est-il trop long ?>"
---

# Playtest complet

Question de cette version : **$ARGUMENTS**

Tu orchestres l'équipe d'agents de `.claude/agents/`. Les agents ne peuvent
pas en lancer d'autres : c'est toi qui les lances (outil Agent,
`subagent_type` = nom de l'agent) et qui écris leurs sorties.

**Ne JAMAIS implémenter une proposition** : ni code, ni réglage, ni
`CLAUDE.md`. Jérôme tranche. Ce playtest ne modifie que `playtests/`.

## 0. Préparer
- Lis `DESIGN.md` et `ROADMAP.md`.
- Version jouée : `version.json`. Runs précédents : `ls playtests/`.
- Personas disponibles : les agents `joueur-*` (si seul le modèle
  `joueur-persona` existe, propose à Jérôme d'en créer 4 à 6 avant de jouer).

## 1. Le harnais
Choisis les options selon la question (`node outils/playtest/run.mjs --aide` :
parcours partiel `--de` / `--a`, `--cible`, `--vitesse`, `--seed`).

```
node outils/playtest/run.mjs --etiquette "<mot-clé>" [options]
```

En arrière-plan si c'est long. Puis, dans le dossier du run :
- écris `question.md` (la question, la date, les options) ;
- vérifie que `carnet.md` est lisible (étapes « ok », captures présentes, pas
  d'erreur dans `run.json`). Si une étape a échoué à cause du script,
  relance une fois ; sinon note-le.

## 2. Les testeurs
Lance en parallèle `testeur-fonctionnel` et `testeur-rendu` avec le chemin
du run. Ils écrivent `tests/<nom>.md`.

**S'il y a un BLOQUANT** : arrête-toi là. Écris `decisions.md` avec la liste
des BLOQUANTS (reproduction, capture) et dis-le à Jérôme.

## 3. Les joueurs
Lance en parallèle, isolés, chaque agent `joueur-*`. Le prompt de chacun ne
contient QUE le chemin absolu du dossier du run et la consigne de lire
`carnet.md` et ses captures. **Ni la question, ni DESIGN.md, ni aucun autre
retour.** Écris chaque réponse telle quelle dans `retours/<agent>.md`.

## 4. La synthèse
Lance `synthetiseur` avec le chemin du run. Il écrit `synthese.md`.

## 5. Les designers, puis le gardien
Lance `designer` deux ou trois fois en parallèle, chacun avec un domaine
choisi selon la question (rythme, récit, toucher, économie, difficulté…),
plus `game-designer` si la question touche la boucle ou l'équilibrage.
Écris leurs réponses dans `designers/<domaine>.md`.
Puis lance `gardien-du-ton` avec toutes les propositions. Écris sa réponse
dans `designers/gardien-du-ton.md`.

## 6. Les décisions
Écris `decisions.md` d'après `playtests/_templates/decisions.md` : chaque
proposition retenue (avec la case `- [ ] **Jérôme tranche** :` vide),
chaque refus motivé, les problèmes MAJEURS et MINEURS pour mémoire.

## 7. Rendre compte
En quelques lignes : la réponse courte à la question, les propositions
retenues, les refus, les problèmes des testeurs, le chemin de
`decisions.md`. Propose de committer le dossier du run ; ne pousse rien
sans accord.
