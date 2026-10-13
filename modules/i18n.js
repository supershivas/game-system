/* ─── Langues — partagé entre les jeux ─────────────────────────────────────
   Source de vérité : supershivas/game-system/modules/i18n.js
   Applique la section 13 de CONVENTIONS.md : le français est la référence ;
   un jeu bilingue passe TOUTES ses chaînes visibles par ce module, avec une
   entrée dans chaque langue, sous une clé stable.

   Module ES sans dépendance :
     import { createI18n } from './lib/i18n.js'
     const i18n = createI18n({
       fr: { 'titre.jouer': 'Jouer', 'pv': '{n} points de vie' },
       en: { 'titre.jouer': 'Play', 'pv': '{n} hit points' },
     }, { lang: prefs.langue || 'fr' })
     i18n.t('pv', { n: 3 })            // « 3 points de vie »
     i18n.L({ fr: 'Oui', en: 'Yes' })  // texte ponctuel, sans clé
     i18n.apply(document)              // remplit les éléments [data-i18n="clé"]
                                       // (et [data-i18n-aria="clé"] → aria-label)
     i18n.setLang('en')
     i18n.missing()                    // clés absentes d'une langue (pour un test)
   ─────────────────────────────────────────────────────────────────────────── */

export function createI18n(dict, { lang = 'fr', fallback = 'fr' } = {}) {
  let current = dict[lang] ? lang : fallback;
  const listeners = new Set();
  const fill = (s, vars) => s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

  const api = {
    get lang() { return current; },
    get langs() { return Object.keys(dict); },
    t(key, vars = {}) {
      const s = dict[current]?.[key] ?? dict[fallback]?.[key];
      if (s == null) { console.warn(`[i18n] clé manquante : ${key}`); return key; }
      return fill(s, vars);
    },
    L(texts, vars = {}) { return fill(texts[current] ?? texts[fallback] ?? '', vars); },
    setLang(l) {
      if (!dict[l]) return;
      current = l;
      if (typeof document !== 'undefined') { document.documentElement.lang = l; api.apply(document); }
      listeners.forEach(f => f(l));
    },
    onChange(f) { listeners.add(f); return () => listeners.delete(f); },
    apply(root) {
      root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = api.t(el.dataset.i18n); });
      root.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', api.t(el.dataset.i18nAria)); });
      root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = api.t(el.dataset.i18nTitle); });
    },
    // { en: ['clé absente en anglais', ...], ... } — un test doit le trouver vide
    missing() {
      const all = new Set(Object.values(dict).flatMap(Object.keys));
      const out = {};
      for (const [l, d] of Object.entries(dict)) {
        const miss = [...all].filter(k => !(k in d));
        if (miss.length) out[l] = miss;
      }
      return out;
    },
  };
  return api;
}
