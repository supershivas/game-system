#!/bin/sh
# Installe un nouveau jeu dans le dossier courant (le repo du jeu, vide ou presque),
# à partir d'une copie locale de game-system.
#
#   git clone --depth 1 https://github.com/supershivas/game-system /tmp/game-system
#   sh /tmp/game-system/templates/installer.sh --nom "Mon jeu" --repo supershivas/mon-jeu \
#      [--slug mon-jeu] [--sans-labo] [--sans-atelier] [--agents aucun|leger|complet] \
#      [--sans-playtest] [--force]
#
# Copie : le jeu de départ (templates/starter), les modules (js/lib/), les
# outils (outils/), les modèles de documents (CLAUDE.md, DESIGN.md,
# ROADMAP.md), la synchronisation (scripts/, .claude/settings.json), le
# workflow GitHub Pages, et, selon les options, les agents, commandes et
# skills Claude Code. Remplace {{NOM}}, {{REPO}}, {{SLUG}}, {{DATE}}.
# Ensuite : retirer les modules inutiles (voir le résumé affiché), lancer
# `node outils/icones.mjs`, `node outils/test-run.mjs`, `node outils/captures.mjs`.
set -e

GS="$(cd "$(dirname "$0")/.." && pwd)"
NOM=""; REPO=""; SLUG=""; LABO=1; ATELIER=1; AGENTS="leger"; PLAYTEST=1; FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --nom) NOM="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --slug) SLUG="$2"; shift 2 ;;
    --sans-labo) LABO=0; shift ;;
    --sans-atelier) ATELIER=0; shift ;;
    --agents) AGENTS="$2"; shift 2 ;;
    --sans-playtest) PLAYTEST=0; shift ;;
    --force) FORCE=1; shift ;;
    *) echo "Option inconnue : $1" >&2; exit 2 ;;
  esac
done
[ -n "$NOM" ] && [ -n "$REPO" ] || { echo "Il faut --nom et --repo." >&2; exit 2; }
[ -n "$SLUG" ] || SLUG="$(basename "$REPO" | tr 'A-Z' 'a-z')"
if [ -f index.html ] && [ $FORCE = 0 ]; then echo "index.html existe déjà : --force pour écraser." >&2; exit 2; fi
DATE="$(date +%Y-%m-%d)"

# Le jeu de départ
cp -R "$GS/templates/starter/." .
# Les modules et les outils (ils suivront game-system grâce au script de synchronisation)
mkdir -p js/lib outils scripts .claude .github/workflows
cp "$GS"/modules/*.js "$GS"/modules/*.css js/lib/
cp "$GS"/outils/*.mjs outils/
cp "$GS/templates/sync-game-system.sh" scripts/
cp "$GS/templates/claude-settings.json" .claude/settings.json
cp "$GS/templates/pages.yml" .github/workflows/pages.yml
cp "$GS/templates/gitignore" .gitignore
for f in CLAUDE.jeu.md:CLAUDE.md DESIGN.md:DESIGN.md ROADMAP.md:ROADMAP.md; do
  src="${f%%:*}"; dst="${f##*:}"
  [ -f "$dst" ] && [ $FORCE = 0 ] || cp "$GS/templates/$src" "$dst"
done

if [ $PLAYTEST = 1 ]; then
  mkdir -p outils/playtest playtests/_templates
  cp "$GS/outils/playtest/run.mjs" outils/playtest/
  cp "$GS"/templates/playtests/_templates/*.md playtests/_templates/
else
  rm -f playtest.parcours.mjs
fi

# Agents, commandes, skills
case "$AGENTS" in
  aucun) ;;
  leger)
    mkdir -p .claude/agents .claude/skills .claude/commands
    for a in game-designer testeur-fonctionnel gardien-du-ton; do cp "$GS/templates/.claude/agents/$a.md" .claude/agents/; done
    for s in equilibrage nouvelle-regle livrer journal variante-labo; do cp -R "$GS/templates/.claude/skills/$s" .claude/skills/; done
    cp "$GS/templates/.claude/commands/verifier.md" .claude/commands/ ;;
  complet)
    mkdir -p .claude
    cp -R "$GS/templates/.claude/agents" "$GS/templates/.claude/commands" "$GS/templates/.claude/skills" .claude/ ;;
  *) echo "--agents : aucun, leger ou complet" >&2; exit 2 ;;
esac

# Sans labo / sans atelier : retirer les pages et leurs liens
if [ $LABO = 0 ]; then
  rm -f labo.html favicon-labo.svg js/labo.js js/lib/labo-shell.js js/lib/labo-shell.css js/lib/labo-timeline.js
  sed -i 's#<a href="labo.html">Labo</a> · ##; s# · <a href="atelier.html">Atelier</a>##' index.html
  sed -i '/href="labo.html"/,/<\/a>/d' atelier.html 2>/dev/null || true
fi
if [ $ATELIER = 0 ]; then
  rm -f atelier.html favicon-atelier.svg js/atelier.js css/atelier.css js/lib/pixel-editor.js js/lib/gh-publish.js
  sed -i 's# · <a href="atelier.html">Atelier</a>##; s#<a href="atelier.html">Atelier</a>##' index.html
  [ -f js/labo.js ] && sed -i "s#, atelier: 'atelier.html'##" js/labo.js
fi
if [ $LABO = 0 ] && [ $ATELIER = 0 ]; then sed -i '/<p class="liens">/d' index.html; fi

# Les marques à remplacer
ESC_NOM="$(printf '%s' "$NOM" | sed 's/[&#\\]/\\&/g')"
grep -rlI --exclude-dir=.git --exclude-dir=node_modules -e '{{NOM}}' -e '{{REPO}}' -e '{{SLUG}}' -e '{{DATE}}' . 2>/dev/null | while read -r f; do
  sed -i "s#{{NOM}}#$ESC_NOM#g; s#{{REPO}}#$REPO#g; s#{{SLUG}}#$SLUG#g; s#{{DATE}}#$DATE#g" "$f"
done

echo "Installé : $NOM ($REPO), clés de sauvegarde « $SLUG: »."
echo "Labo : $([ $LABO = 1 ] && echo oui || echo non) · Atelier : $([ $ATELIER = 1 ] && echo oui || echo non) · Agents : $AGENTS · Playtest : $([ $PLAYTEST = 1 ] && echo oui || echo non)"
echo "Modules dans js/lib/ : $(ls js/lib | tr '\n' ' ')"
echo "À faire : retirer de js/lib/ les modules que le jeu n'utilise pas (ils ne seront plus synchronisés),"
echo "          redessiner favicon.svg puis node outils/icones.mjs, et remplir CLAUDE.md et DESIGN.md."
