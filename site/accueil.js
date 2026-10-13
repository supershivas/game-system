// La page d'accueil de game-system : écrire le prompt d'un nouveau jeu,
// piocher dans l'inspiration, lire les fichiers du dépôt.
//
// Une seule source de vérité : la page LIT les fichiers du dépôt
// (templates/PROMPT-NOUVEAU-JEU.md, GENRES.md, INSPIRATION.md, MES-INSPIRATIONS.md) au lieu d'en
// recopier le contenu. Changer ces fichiers change la page.
// Si un fichier manque sur le site (GitHub Pages et les dossiers « . »), il
// est lu sur raw.githubusercontent.com.

const RAW = 'https://raw.githubusercontent.com/supershivas/game-system/main/';
const GITHUB = 'https://github.com/supershivas/game-system/blob/main/';
const CLE = 'game-system:formulaire';
const $ = id => document.getElementById(id);
const el = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k in e && k !== 'list') e[k] = v;
    else if (v != null && v !== false) e.setAttribute(k, v === true ? '' : v);
  }
  e.append(...kids.flat().filter(k => k != null));
  return e;
};

// ─── Les fichiers lisibles ────────────────────────────────────────────────
const AGENTS = ['game-designer', 'ux-designer', 'directeur-artistique', 'gardien-du-ton', 'designer', 'testeur-fonctionnel', 'testeur-rendu', 'joueur-persona', 'synthetiseur'];
const SKILLS = ['equilibrage', 'nouvelle-regle', 'livrer', 'journal', 'variante-labo'];
const MODULES = ['app-update.js', 'keys.js', 'pointer.js', 'gamepad.js', 'loop.js', 'pixel-canvas.js', 'rng.js', 'save.js', 'debug.js', 'sprites.js', 'audio.js', 'i18n.js', 'game.css', 'labo-shell.js', 'labo-shell.css', 'pixel-editor.js', 'gh-publish.js'];
const OUTILS = ['test-run.mjs', 'captures.mjs', 'audit-ecran.mjs', 'lisibilite.mjs', 'stamp-version.mjs', 'icones.mjs', 'navigateur.mjs', 'playtest/run.mjs'];
const DOCS = [
  ['Démarrer', ['README.md', 'templates/PROMPT-NOUVEAU-JEU.md', 'MES-INSPIRATIONS.md', 'INSPIRATION.md', 'GENRES.md']],
  ['Règles', ['CONVENTIONS.md', 'DESIGN-SYSTEM.md', 'LECONS.md', 'CLAUDE.md']],
  ['Profils de rendu', ['profils/pixel-2d-canvas.md', 'profils/pixel-2d-phaser.md', 'profils/pixel-3d-three.md', 'profils/dom-cartes.md', 'profils/vectoriel.md']],
  ['Modèles', ['templates/CLAUDE.jeu.md', 'templates/DESIGN.md', 'templates/ROADMAP.md', 'templates/installer.sh', 'templates/sync-game-system.sh', 'templates/pages.yml']],
  ['Agents', AGENTS.map(a => `templates/.claude/agents/${a}.md`)],
  ['Commandes et skills', ['playtest', 'playtest-light', 'verifier'].map(c => `templates/.claude/commands/${c}.md`).concat(SKILLS.map(s => `templates/.claude/skills/${s}/SKILL.md`))],
  ['Modules', MODULES.map(m => `modules/${m}`)],
  ['Outils', OUTILS.map(o => `outils/${o}`)],
];
const TOUS = DOCS.flatMap(([, f]) => f);
const titreDe = p => p === 'templates/PROMPT-NOUVEAU-JEU.md' ? 'Prompt de démarrage'
  : p.endsWith('/SKILL.md') ? `skill ${p.split('/').at(-2)}` : p.replace(/^templates\/(\.claude\/)?/, '').replace(/^(agents|commands)\//, '');

const cache = new Map();
async function lire(chemin) {
  if (cache.has(chemin)) return cache.get(chemin);
  const essai = async url => { const r = await fetch(url, { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status); return r.text(); };
  const p = essai(chemin).catch(() => essai(RAW + chemin));
  cache.set(chemin, p);
  p.catch(() => cache.delete(chemin));
  return p;
}

// ─── Markdown → HTML (le nécessaire pour les fichiers du dépôt) ───────────
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function resoudre(base, lien) {
  if (/^(https?:|mailto:|#)/.test(lien)) return lien;
  const [chemin, ancre] = lien.split('#');
  const parts = base.split('/').slice(0, -1);
  for (const s of chemin.split('/')) { if (s === '..') parts.pop(); else if (s && s !== '.') parts.push(s); }
  const p = parts.join('/');
  if (TOUS.includes(p)) return `#doc/${p}`;
  return GITHUB + p + (ancre ? `#${ancre}` : '');
}
function inline(s, base) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const href = resoudre(base, u.replace(/&amp;/g, '&'));
    const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${ext}>${t}</a>`;
  });
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(«])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}
export function markdown(md, base = '') {
  const lignes = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  if (lignes[0] === '---') {
    const fin = lignes.indexOf('---', 1);
    if (fin > 0) { out.push(`<pre class="entete-yaml"><code>${esc(lignes.slice(1, fin).join('\n'))}</code></pre>`); i = fin + 1; }
  }
  const liste = [];      // pile des listes ouvertes : { type, indent }
  const fermerListes = (jusqua = -1) => { while (liste.length && liste.at(-1).indent > jusqua) out.push(`</li></${liste.pop().type}>`); };
  let para = [];
  const fermerPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '), base)}</p>`); para = []; } };

  for (; i < lignes.length; i++) {
    const l = lignes[i];
    const t = l.trim();
    if (/^(```|~~~)/.test(t)) {
      fermerPara(); fermerListes();
      const bloc = [];
      for (i++; i < lignes.length && !/^(```|~~~)/.test(lignes[i].trim()); i++) bloc.push(lignes[i]);
      out.push(`<pre><code>${esc(bloc.join('\n'))}</code></pre>`);
      continue;
    }
    if (t.startsWith('<!--')) {
      fermerPara();
      const bloc = [t];
      while (!bloc.at(-1).includes('-->') && i + 1 < lignes.length) bloc.push(lignes[++i].trim());
      const texte = bloc.join(' ').replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
      if (texte) out.push(`<blockquote class="commentaire">${inline(texte, base)}</blockquote>`);
      continue;
    }
    if (!t) { fermerPara(); if (!/^\s*([-*]|\d+\.)\s/.test(lignes[i + 1] || '')) fermerListes(); continue; }
    const h = t.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      fermerPara(); fermerListes();
      const id = h[2].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      out.push(`<h${h[1].length} id="${id}">${inline(h[2], base)}</h${h[1].length}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(t)) { fermerPara(); fermerListes(); out.push('<hr>'); continue; }
    if (t.startsWith('|') && /^\|?\s*:?-{2,}/.test((lignes[i + 1] || '').trim())) {
      fermerPara(); fermerListes();
      const cellules = s => s.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const tete = cellules(t);
      const rangees = [];
      for (i += 2; i < lignes.length && lignes[i].trim().startsWith('|'); i++) rangees.push(cellules(lignes[i]));
      i--;
      out.push(`<table><thead><tr>${tete.map(c => `<th>${inline(c, base)}</th>`).join('')}</tr></thead><tbody>${
        rangees.map(r => `<tr>${r.map(c => `<td>${inline(c, base)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      continue;
    }
    if (t.startsWith('>')) {
      fermerPara(); fermerListes();
      const bloc = [];
      for (; i < lignes.length && lignes[i].trim().startsWith('>'); i++) bloc.push(lignes[i].trim().replace(/^>\s?/, ''));
      i--;
      out.push(`<blockquote>${markdown(bloc.join('\n'), base)}</blockquote>`);
      continue;
    }
    const item = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (item) {
      fermerPara();
      const indent = item[1].length;
      const type = /\d/.test(item[2]) ? 'ol' : 'ul';
      if (!liste.length || indent > liste.at(-1).indent) { out.push(`<${type}><li>`); liste.push({ type, indent }); }
      else {
        fermerListes(indent);
        if (!liste.length) { out.push(`<${type}><li>`); liste.push({ type, indent }); } else out.push('</li><li>');
      }
      out.push(inline(item[3], base));
      continue;
    }
    if (liste.length && /^\s+/.test(l)) { out.push(' ' + inline(t, base)); continue; }
    fermerListes();
    para.push(t);
  }
  fermerPara(); fermerListes();
  return out.join('\n');
}

// ─── Les catalogues, lus dans les fichiers ────────────────────────────────
function colonne1(lignesTableau) {
  return lignesTableau.filter(l => l.startsWith('|') && !/^\|\s*:?-/.test(l)).slice(1)
    .map(l => l.split('|')[1].trim()).filter(Boolean);
}
function parseGenres(md) {
  const parties = md.split(/^## /m).slice(1);
  const parTitre = t => parties.find(p => p.startsWith(t)) || '';
  const lignes = s => s.split('\n').map(l => l.trim());
  const familles = parTitre('1.').split(/^### /m).slice(1).map(bloc => ({
    titre: bloc.split('\n')[0].replace(/^[A-Z]\.\s*/, '').trim(),
    genres: colonne1(lignes(bloc)),
  }));
  return {
    familles,
    vues: colonne1(lignes(parTitre('2.'))),
    rendus: colonne1(lignes(parTitre('3.'))),
    publics: colonne1(lignes(parTitre('4.'))),
    sessions: colonne1(lignes(parTitre('5.'))),
  };
}
// perso : MES-INSPIRATIONS.md (étages : noyau, fil, réserve) ; sinon INSPIRATION.md
function parseInspiration(md, perso = false) {
  const items = [];
  const net = t => (t || '').replace(/\*/g, '');
  let section = '', sous = '';
  for (const l of md.split('\n')) {
    if (l.startsWith('## ')) { section = l.slice(3).trim(); sous = ''; continue; }
    if (l.startsWith('### ')) { sous = l.slice(4).trim(); continue; }
    // - **Nom** (repère) [servi : Jeu] — ce qu'on en prend.   (repère et servi facultatifs)
    const m = l.match(/^- \*\*(.+?)\*\*\s*(?:\(([^)]*)\))?\s*(?:\[\s*servi\s*:\s*([^\]]*)\])?\s*(?:—\s*(.*))?$/);
    if (!m || !section || section.startsWith('Comment')) continue;
    const etage = !perso ? 'general' : section.startsWith('Le noyau') ? 'noyau' : section.startsWith('La réserve') ? 'reserve' : 'fil';
    items.push({ perso, etage, section, sous, nom: m[1], repere: net(m[2]), servi: (m[3] || '').trim(), desc: net(m[4]) });
  }
  return items;
}
const MAX_INSPI = 6;

// ─── L'état du formulaire (gardé dans ce navigateur) ──────────────────────
const vide = () => ({ nom: '', repo: '', pitch: '', references: '', inspirations: [], decisions: {}, precisions: {}, lot: '', critere: '', refus: '' });
let etat = vide();
try { etat = { ...vide(), ...JSON.parse(localStorage.getItem(CLE) || '{}') }; } catch { /* navigation privée */ }
const garder = () => { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch { /* rien */ } };

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function decisionsDe(g) {
  return [
    ['Le jeu', [
      { id: 'genre', titre: 'Genre', aide: 'Plusieurs = un jeu hybride ; Claude demandera laquelle porte la boucle principale.', plusieurs: true, groupes: g.familles.map(f => [f.titre, f.genres]), precision: true },
      { id: 'vue', titre: 'Vue', options: g.vues },
      { id: 'public', titre: 'Public', options: g.publics },
      { id: 'session', titre: "Forme d'une session", options: g.sessions },
    ]],
    ["L'image et le son", [
      { id: 'rendu', titre: 'Rendu', aide: 'Voir les profils techniques dans Documents.', options: g.rendus, precision: true },
      { id: 'palette', titre: 'Palette', options: ['3 couleurs (fond, encre, accent)', 'Game Boy (4 tons)', 'PICO-8 (16)', 'Sweetie 16', 'Endesga 32', 'Sur mesure'], precision: true, aidePrecision: 'Ambiance ou couleurs voulues' },
      { id: 'resolution', titre: 'Résolution logique et taille du héros', texte: '320 × 180, héros de 16 px' },
      { id: 'son', titre: 'Son', options: ['Bruitages synthétisés seulement', 'Musique en fichiers + bruitages synthétisés', 'Musique générative', 'Aucun son pour la v0'] },
    ]],
    ['Jouer', [
      { id: 'cible', titre: 'Cible', options: ['Téléphone en portrait', 'Téléphone en paysage', 'Bureau', 'Téléphone et bureau'] },
      { id: 'commandes', titre: 'Commandes', plusieurs: true, options: ['Clavier', 'Toucher / gestes au doigt', 'Souris', 'Manette'] },
      { id: 'langues', titre: 'Langues', options: ['Français seulement', 'Français + anglais'] },
      { id: 'horizon', titre: 'Horizon', options: ['Navigateur seulement', 'Porte ouverte vers Steam'] },
    ]],
    ["L'atelier du développeur", [
      { id: 'labo', titre: 'Labo', options: ['Dès la v0', 'Plus tard', 'Jamais'] },
      { id: 'atelier', titre: 'Atelier', plusieurs: true, options: ['Dessins (éditeur de pixels)', 'Réglages chiffrés', 'Placement sur la carte / niveaux', 'Textes et dialogues', "Pas d'atelier pour l'instant"] },
      { id: 'outils', titre: 'Outils de vérification', plusieurs: true, options: ['Tests des règles et de la sauvegarde', "Captures et audit d'écran", 'Lisibilité (contraste, silhouettes)', "Simulateur d'équilibrage", 'Harnais de playtest'] },
      { id: 'agents', titre: "Équipe d'agents", options: ['Aucune', 'Légère (game-designer, testeur, gardien du ton)', 'Complète (designers, testeurs, joueurs fictifs, /playtest)'] },
    ]],
  ];
}

// ─── Le formulaire ────────────────────────────────────────────────────────
let SECTIONS = [];
let INSPI = [];

function construireDecisions() {
  const zone = $('decisions');
  zone.replaceChildren();
  for (const [titre, liste] of SECTIONS) {
    const bloc = el('section', { class: 'bloc' }, el('h2', {}, titre));
    for (const d of liste) {
      const div = el('div', { class: 'decision' }, el('span', { class: 'titre' }, d.titre));
      if (d.aide) div.append(el('span', { class: 'aide-champ' }, d.aide));
      if (d.texte) {
        div.append(el('input', { value: etat.decisions[d.id] || '', placeholder: `${d.texte} — vide : à me demander`, 'aria-label': d.titre,
          oninput: e => { etat.decisions[d.id] = e.target.value; maj(); } }));
      } else if (d.plusieurs) {
        const choix = el('div', { class: 'choix' });
        const valeurs = new Set(etat.decisions[d.id] || []);
        const groupes = d.groupes || [[null, d.options]];
        for (const [famille, options] of groupes) {
          if (famille) choix.append(el('span', { class: 'famille' }, famille));
          for (const o of options) {
            choix.append(el('label', {}, el('input', { type: 'checkbox', checked: valeurs.has(o), onchange: e => {
              const s = new Set(etat.decisions[d.id] || []);
              e.target.checked ? s.add(o) : s.delete(o);
              etat.decisions[d.id] = [...s];
              maj();
            } }), o));
          }
        }
        div.append(choix, el('small', { class: 'aide-champ' }, 'Rien de coché : à me demander.'));
      } else {
        const choix = el('div', { class: 'choix', role: 'radiogroup', 'aria-label': d.titre });
        const nom = `d-${d.id}`;
        const courant = etat.decisions[d.id] || '';
        choix.append(el('label', { class: 'demander' }, el('input', { type: 'radio', name: nom, checked: !courant, onchange: () => { etat.decisions[d.id] = ''; maj(); } }), 'À me demander'));
        for (const o of d.options) {
          choix.append(el('label', {}, el('input', { type: 'radio', name: nom, checked: courant === o, onchange: () => { etat.decisions[d.id] = o; maj(); } }), o));
        }
        div.append(choix);
      }
      if (d.precision) {
        div.append(el('input', { class: 'autre', value: etat.precisions[d.id] || '', placeholder: d.aidePrecision || 'Précision (facultatif)', 'aria-label': `${d.titre} : précision`,
          oninput: e => { etat.precisions[d.id] = e.target.value; maj(); } }));
      }
      bloc.append(div);
    }
    zone.append(bloc);
  }
}

function lierChamps() {
  const f = $('formulaire');
  for (const nom of ['nom', 'repo', 'pitch', 'references', 'lot', 'critere', 'refus']) {
    const champ = f.elements[nom];
    champ.value = etat[nom] || '';
    champ.addEventListener('input', () => { etat[nom] = champ.value; maj(); });
  }
  $('effacer').onclick = () => {
    if (!confirm('Effacer tout le formulaire ?')) return;
    etat = vide(); garder();
    lierValeurs(); construireDecisions(); maj();
  };
}
function lierValeurs() {
  const f = $('formulaire');
  for (const nom of ['nom', 'repo', 'pitch', 'references', 'lot', 'critere', 'refus']) f.elements[nom].value = etat[nom] || '';
}

function etiquettesChoisies() {
  const zone = $('inspirations-choisies');
  zone.replaceChildren(...etat.inspirations.map(n => el('button', { type: 'button', class: 'etiquette choisie', title: 'Retirer',
    onclick: () => basculerInspiration(n) }, n, el('span', { class: 'x', 'aria-hidden': 'true' }, '×'))));
  zone.append(el('small', { class: 'aide-champ' }, etat.inspirations.length ? `${etat.inspirations.length} / ${MAX_INSPI}` : `Aucune pour l'instant (${MAX_INSPI} au plus).`));
}
function basculerInspiration(nom) {
  const s = new Set(etat.inspirations);
  if (!s.has(nom) && s.size >= MAX_INSPI) { toast(`${MAX_INSPI} inspirations au plus : retires-en une d'abord`); return; }
  s.has(nom) ? s.delete(nom) : s.add(nom);
  etat.inspirations = [...s];
  maj();
  rendreInspiration();
}

// ─── Le prompt ────────────────────────────────────────────────────────────
let MODELE = '';
function generer() {
  const nom = etat.nom.trim() || '[Nom du jeu]';
  const repo = (etat.repo.trim() || slug(etat.nom)) || '[repo]';
  const pitch = etat.pitch.trim();
  let p = MODELE.split(/\n---\n/).slice(1).join('\n---\n').trim();
  p = p.replaceAll('[Nom du jeu]', nom).replaceAll('supershivas/[repo]', `supershivas/${repo}`);
  if (pitch) p = p.replace(/Le pitch : \[[\s\S]*?\]\n/, `Le pitch : ${pitch}\n`);

  const ajouts = [];
  if (etat.references.trim()) ajouts.push(`Références : ${etat.references.trim()}`);
  if (etat.inspirations.length) {
    const details = etat.inspirations.map(n => {
      const it = INSPI.find(x => x.nom === n);
      if (!it) return `- **${n}**`;
      return `- **${n}**${it.repere ? ` (${it.repere})` : ''} — ${it.desc}${it.servi ? ` (déjà servi : ${it.servi})` : ''}${it.perso ? ' *(à moi)*' : ''}`;
    });
    ajouts.push(`Inspirations (game-system : \`MES-INSPIRATIONS.md\` pour celles marquées « à moi », \`INSPIRATION.md\` pour les autres ; on prend l'air, on invente les noms) :\n${details.join('\n')}`);
  }
  const decisions = [];
  for (const [, liste] of SECTIONS) {
    for (const d of liste) {
      const v = etat.decisions[d.id];
      const pr = (etat.precisions[d.id] || '').trim();
      const val = Array.isArray(v) ? v.join(', ') : (v || '').trim();
      if (val || pr) decisions.push(`- **${d.titre}** : ${[val, pr].filter(Boolean).join(' — ')}`);
    }
  }
  const lot = etat.lot.trim().split('\n').map(s => s.trim()).filter(Boolean);
  if (lot.length) decisions.push(`- **Lot minimal** :\n${lot.map(l => `  - ${l.replace(/^[-*]\s*/, '')}`).join('\n')}`);
  if (etat.critere.trim()) decisions.push(`- **Critère de validation** : ${etat.critere.trim()}`);
  const refus = etat.refus.trim().split('\n').map(s => s.trim()).filter(Boolean);
  if (refus.length) decisions.push(`- **Ce que le jeu refuse** :\n${refus.map(l => `  - ${l.replace(/^[-*]\s*/, '')}`).join('\n')}`);
  if (decisions.length) {
    ajouts.push(`**Décisions déjà prises** — ne me les repose pas. Au point 2, pose seulement les questions qui restent (saute un tour qui n'en a plus), et reprends ces décisions telles quelles dans le résumé :\n${decisions.join('\n')}`);
  }
  if (ajouts.length) p = p.replace('\nAvant d\'écrire du code :', `\n${ajouts.join('\n\n')}\n\nAvant d'écrire du code :`);
  return p;
}

function maj() {
  garder();
  $('repo').placeholder = slug(etat.nom) || 'nom-du-jeu';
  etiquettesChoisies();
  if (!MODELE) return;
  const texte = generer();
  $('prompt').value = texte;
  const manque = [!etat.nom.trim() && 'le nom', !etat.pitch.trim() && 'le pitch'].filter(Boolean);
  $('manque').textContent = manque.length ? `Il manque ${manque.join(' et ')}.` : '';
  const nb = SECTIONS.flatMap(([, l]) => l).filter(d => { const v = etat.decisions[d.id]; return Array.isArray(v) ? v.length : (v || '').trim(); }).length;
  const total = SECTIONS.flatMap(([, l]) => l).length;
  $('compte').textContent = `${nb} / ${total} décisions prises · ${texte.length.toLocaleString('fr')} caractères`;
}

function toast(t) { const e = $('toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { e.hidden = true; }, 2200); }
$('copier').onclick = async () => {
  const t = $('prompt').value;
  try { await navigator.clipboard.writeText(t); }
  catch { $('prompt').select(); document.execCommand('copy'); }
  toast(etat.nom.trim() && etat.pitch.trim() ? 'Prompt copié' : 'Copié — il manque encore le nom ou le pitch');
};
$('telecharger').onclick = () => {
  const blob = new Blob([$('prompt').value], { type: 'text/markdown' });
  const a = el('a', { href: URL.createObjectURL(blob), download: `prompt-${(etat.repo.trim() || slug(etat.nom)) || 'nouveau-jeu'}.md` });
  document.body.append(a); a.click(); a.remove();
};

// ─── L'inspiration ────────────────────────────────────────────────────────
const ouverts = new Set();   // les blocs dépliés, gardés d'un rendu à l'autre
function rendreInspiration() {
  const zone = $('inspiration');
  if (!INSPI.length) return;
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const f = norm($('filtre').value.trim());
  const choisis = new Set(etat.inspirations);
  const correspond = it => !f || norm(`${it.nom} ${it.repere} ${it.desc} ${it.section} ${it.sous}`).includes(f);
  const carte = it => el('button', {
    type: 'button', class: `item-inspi${choisis.has(it.nom) ? ' choisie' : ''}`, 'aria-pressed': String(choisis.has(it.nom)),
    onclick: () => basculerInspiration(it.nom),
  }, el('b', {}, it.nom, it.repere ? el('span', { class: 'repere' }, ` (${it.repere})`) : null),
    it.servi ? el('span', { class: 'servi' }, `servi : ${it.servi}`) : null, el('span', { class: 'desc' }, it.desc));
  const liste = items => el('div', { class: 'liste-inspi' }, items.map(carte));
  // Un bloc replié : ouvert s'il l'était, ou dès qu'on filtre
  const repli = (cle, titre, items, contenu) => {
    const d = el('details', { class: 'repli', open: !!f || ouverts.has(cle) },
      el('summary', {}, titre, el('span', { class: 'nb' }, String(items.length))), contenu);
    d.addEventListener('toggle', () => { if (!f) d.open ? ouverts.add(cle) : ouverts.delete(cle); });
    return d;
  };
  const grouper = (items, cle) => {
    const m = new Map();
    for (const it of items) { const k = it[cle]; if (!m.has(k)) m.set(k, []); m.get(k).push(it); }
    return m;
  };

  const blocs = [];
  // 1. Mes inspirations : le noyau visible, les fils repliés, la réserve seulement au filtre
  const perso = INSPI.filter(it => it.perso && correspond(it));
  const noyau = perso.filter(it => it.etage === 'noyau');
  const fils = grouper(perso.filter(it => it.etage === 'fil'), 'sous');
  const reserve = perso.filter(it => it.etage === 'reserve');
  if (noyau.length || fils.size || (f && reserve.length)) {
    blocs.push(el('section', { class: 'section-inspi' },
      el('h2', {}, 'Mes inspirations'),
      noyau.length ? el('div', { class: 'carte-inspi' }, el('h3', {}, 'Le noyau'), liste(noyau)) : null,
      fils.size ? el('h3', {}, 'Les fils') : null,
      ...[...fils].map(([fil, items]) => repli(`fil:${fil}`, fil, items, liste(items))),
      f && reserve.length ? repli('reserve', 'La réserve', reserve, liste(reserve)) : null));
  }
  // 2. La culture générale : une section repliée par thème
  const general = grouper(INSPI.filter(it => !it.perso && correspond(it)), 'section');
  if (general.size) {
    blocs.push(el('section', { class: 'section-inspi' },
      el('h2', {}, 'Culture générale'),
      ...[...general].map(([section, items]) => repli(`gen:${section}`, section, items,
        [...grouper(items, 'sous')].map(([sous, its]) => el('div', { class: 'carte-inspi' }, sous ? el('h3', {}, sous) : null, liste(its)))))));
  }
  zone.replaceChildren(...blocs);
  if (!blocs.length) zone.append(el('p', { class: 'note' }, 'Rien ne correspond.'));
}

// Un tirage : une période, une œuvre, un jeu, un personnage (le hasard du
// navigateur est permis ici : ce n'est pas un jeu)
function tirer() {
  const au_hasard = l => l[Math.floor(Math.random() * l.length)];
  const pioche = prefixe => au_hasard(INSPI.filter(i => !i.perso && i.section.startsWith(prefixe)));
  const tirage = [
    ['De moi', au_hasard(INSPI.filter(i => i.perso && i.etage !== 'reserve'))],
    ['Période ou lieu', pioche('Périodes')], ["L'image", pioche('Œuvres')], ['La mécanique', pioche('Jeux')],
  ].filter(([, i]) => i);
  const zone = $('tirage');
  zone.hidden = false;
  zone.replaceChildren(
    el('ol', {}, tirage.map(([role, it]) => el('li', {}, el('strong', {}, `${role} : `), `${it.nom}${it.repere ? ` (${it.repere})` : ''} — ${it.desc}`))),
    el('div', { class: 'actions' },
      el('button', { type: 'button', class: 'bouton', onclick: () => {
        const s = new Set(etat.inspirations);
        let refusees = 0;
        tirage.forEach(([, it]) => { if (s.has(it.nom)) return; if (s.size < MAX_INSPI) s.add(it.nom); else refusees++; });
        etat.inspirations = [...s]; maj(); rendreInspiration();
        toast(refusees ? `Ajoutées, sauf ${refusees} : ${MAX_INSPI} au plus` : 'Ajoutées au prompt');
      } }, 'Ajouter au prompt'),
      el('button', { type: 'button', class: 'bouton secondaire', onclick: tirer }, 'Relancer')),
  );
}
$('tirer').onclick = tirer;
$('tirage-rapide').onclick = () => { location.hash = '#inspiration'; setTimeout(tirer, 50); };
$('filtre').addEventListener('input', rendreInspiration);

// ─── Les documents ────────────────────────────────────────────────────────
function construireListeDocs() {
  $('docs-liste').replaceChildren(...DOCS.flatMap(([groupe, fichiers]) => [
    el('h4', {}, groupe),
    ...fichiers.map(f => el('a', { href: `#doc/${f}`, 'data-chemin': f }, titreDe(f))),
  ]));
  $('docs-choix').replaceChildren(...DOCS.map(([groupe, fichiers]) => el('optgroup', { label: groupe },
    fichiers.map(f => el('option', { value: f }, titreDe(f))))));
  $('docs-choix').onchange = e => { location.hash = `#doc/${e.target.value}`; };
}
async function ouvrirDoc(chemin, ancre) {
  for (const a of $('docs-liste').querySelectorAll('a')) a.classList.toggle('actif', a.dataset.chemin === chemin);
  $('docs-choix').value = chemin;
  const article = $('doc');
  article.replaceChildren(el('p', { class: 'note' }, 'Chargement…'));
  try {
    const texte = await lire(chemin);
    const source = el('p', { class: 'doc-source' }, el('a', { href: GITHUB + chemin, target: '_blank', rel: 'noopener' }, chemin), ' sur GitHub');
    const corps = el('div');
    if (chemin.endsWith('.md')) corps.innerHTML = markdown(texte, chemin);
    else corps.append(el('pre', {}, el('code', {}, texte)));
    article.replaceChildren(source, corps);
    const cible = ancre && article.querySelector(`#${CSS.escape(ancre)}`);
    if (cible) cible.scrollIntoView(); else window.scrollTo(0, 0);
  } catch {
    article.replaceChildren(el('p', {}, `Impossible de lire ${chemin}.`));
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────
function route() {
  const h = decodeURIComponent(location.hash.slice(1)) || 'nouveau';
  const [vue, ...reste] = h.split('/');
  const nomVue = ['nouveau', 'inspiration', 'doc'].includes(vue) ? vue : 'nouveau';
  for (const v of ['nouveau', 'inspiration', 'doc']) $(`vue-${v}`).hidden = v !== nomVue;
  for (const a of document.querySelectorAll('.onglets a')) a.classList.toggle('actif', a.dataset.vue === nomVue);
  if (nomVue === 'doc') {
    const [chemin, ancre] = (reste.join('/') || 'README.md').split('#');
    ouvrirDoc(TOUS.includes(chemin) ? chemin : 'README.md', ancre);
  }
  if (nomVue === 'inspiration') rendreInspiration();
}
window.addEventListener('hashchange', route);

// ─── Démarrage ────────────────────────────────────────────────────────────
construireListeDocs();
lierChamps();
etiquettesChoisies();
route();
try {
  const [modele, genres, inspiration, mesInspirations] = await Promise.all([
    lire('templates/PROMPT-NOUVEAU-JEU.md'), lire('GENRES.md'), lire('INSPIRATION.md'), lire('MES-INSPIRATIONS.md').catch(() => ''),
  ]);
  MODELE = modele;
  SECTIONS = decisionsDe(parseGenres(genres));
  INSPI = [...parseInspiration(mesInspirations, true), ...parseInspiration(inspiration)];
  construireDecisions();
  rendreInspiration();
  maj();
} catch (e) {
  $('manque').textContent = `Impossible de lire les fichiers du dépôt (${e.message}).`;
}
