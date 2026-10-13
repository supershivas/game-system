---
name: variante-labo
description: Ajouter un sujet ou une variante au Labo de {{NOM}} pour comparer avant de choisir, puis brancher la variante retenue dans le jeu. À utiliser dès que Jérôme hésite entre plusieurs rendus, réglages, animations ou écrans.
---

# Comparer dans le labo, puis adopter

Section 16 des conventions. Le labo **montre** ; il ne modifie jamais le
contenu du jeu (c'est l'atelier).

## Ajouter

1. Dans `js/labo.js`, tableau `GROUPES` : ajoute le sujet (dans le bon
   groupe) ou la variante. **A est toujours l'actuelle** (`status:
   'actuelle'`), les suivantes B, C… avec un titre et une phrase qui dit ce
   qu'elle change.
2. Le rendu utilise **les mêmes modules que le jeu** (rendu, sprites, son,
   règles), avec des réglages modifiés : ce qu'on voit est ce que le jeu
   dessinera. Pas de copie du code du jeu dans le labo.
3. Données d'exemple en dur ; le labo ne lit ni n'écrit la sauvegarde.
4. Une animation rend une fonction de nettoyage (arrêter la boucle).
5. Vérifie : `node outils/captures.mjs --page labo.html`, et donne l'adresse
   avec l'ancre (`labo.html#sujet-B`).

## Adopter

Quand Jérôme choisit : marque la variante `status: 'retenue'`, branche-la
dans le jeu (données ou code), passe l'ancienne A en `ancienne` ou retire-la,
et incrémente la version (le joueur voit la différence).
