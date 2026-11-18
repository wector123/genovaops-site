# GenovaOps — Site vitrine

Site vitrine statique pour GenovaOps (workflows n8n, marque blanche).
HTML + CSS + JS vanilla, sans framework, sans build step. Déployable tel quel
sur n'importe quel hébergement statique.

## Structure

```
genovaops/
├── index.html               # Page principale (9 sections)
├── mentions-legales.html    # Mentions légales (avec champs [À COMPLÉTER])
├── confidentialite.html      # Politique de confidentialité
├── README.md                # Ce fichier
├── A-COMPLETER.md            # Liste de tout ce qu'Achille doit compléter
└── assets/
    ├── css/
    │   └── styles.css        # Styles (palette Inter, responsive)
    ├── js/
    │   └── main.js           # Toggle FR/EN, menu mobile, FAQ, formulaire
    └── img/
        ├── logo-violet.svg   # Logo violet #7b2cbf
        ├── logo-noir.svg     # Logo noir
        ├── favicon.svg       # Favicon SVG
        ├── favicon-32.png    # Favicon PNG 32px
        ├── apple-touch-icon.png  # Icône Apple 180px
        ├── og-image.png      # Image Open Graph 1200x630
        ├── video-thumb.jpg   # Vignette de la vidéo principale
        └── workflow-*.jpg    # Captures n8n des démos
```

## Prévisualiser en local

Le site est 100% statique. Tu peux l'ouvrir directement dans un navigateur,
mais pour que les chemins relatifs et le formulaire marchent correctement,
il vaut mieux servir les fichiers en HTTP :

```bash
cd genovaops
python3 -m http.server 8080
# Ouvre http://localhost:8080 dans ton navigateur
```

Ou avec Node :

```bash
npx serve genovaops
```

## Déploiement

Le dossier `genovaops/` peut être déposé tel quel sur :

- **Netlify** : glisser-déposer le dossier `genovaops/` dans Netlify Drop.
  Domaine `genovaops.netlify.app` par défaut, puis brancher `genovaops.com`.
- **Vercel** : `vercel deploy` (ou import du dossier via le dashboard).
- **Cloudflare Pages** : connecter le dépôt Git, build command vide,
  output directory `genovaops`.
- **GitHub Pages** : pousser le dossier `genovaops/` à la racine d'une branche
  `gh-pages`, ou à la racine d'un dépôt dédié.
- **OVH / hébergement classique** : uploader le contenu de `genovaops/` par FTP
  dans le dossier `www/` (ou équivalent).

Aucune build, aucune dépendance npm à installer.

## Nom de domaine

1. Acheter `genovaops.com` (ou un autre) chez un registrar (Gandi, Namecheap,
   OVH, etc.).
2. Chez l'hébergeur statique, ajouter le domaine personnalisé.
3. Mettre à jour les DNS (CNAME ou A) selon les instructions de l'hébergeur.
4. Une fois le HTTPS actif, remplacer `http://` par `https://` si nécessaire.

## SEO et partage social

Déjà configuré dans `index.html` :

- `<title>` et `<meta name="description">` en français.
- Balises Open Graph (`og:title`, `og:description`, `og:image`, `og:url`).
- `og:image` pointe vers `assets/img/og-image.png` (1200x630).
- Twitter Card `summary_large_image`.
- `lang="fr"` sur `<html>`.
- Canonical : `https://www.genovaops.com/` (à adapter si autre domaine).

**Avant de publier** : remplacer les URLs `https://www.genovaops.com/` par ton
domaine réel dans `index.html`, `mentions-legales.html` et `confidentialite.html`.

## Accessibilité

- Contrastes vérifiés (texte sur fond clair, boutons violets sur fond clair).
- Focus visible (outline violet).
- `prefers-reduced-motion` respecté (animations désactivées si l'utilisateur
  le demande dans ses préférences système).
- Images dotées d'un `alt` (descriptif) ou `aria-hidden="true"` (décoratives).
- Navigation au clavier : menu mobile fermable avec Échap, FAQ au clavier.

## Performance

- Aucune bibliothèque JavaScript. `main.js` fait moins de 8 Ko.
- Police Inter chargée depuis Google Fonts avec `preconnect`.
- Images en JPEG, chargées en différé (`loading="lazy"`).
- Pas de framework CSS.
- Vidéos YouTube chargées seulement au clic.

## Compatibilité navigateurs

Testé sur les navigateurs modernes (Chrome, Firefox, Safari, Edge récents).
Le `backdrop-filter` et `IntersectionObserver` sont supportés partout depuis
plusieurs années.

## Maintenance

- Pour changer une couleur, édite les variables CSS en haut de
  `assets/css/styles.css` (section `:root`).
- Pour changer un texte, édite directement le HTML correspondant dans
  `index.html`. Les textes bilingues sont dans des `<span data-lang="fr">`
  et `<span data-lang="en" hidden>`.
- Pour ajouter une question FAQ, duplique un bloc `<div class="faq-item" data-faq>` dans `index.html`.
- Vidéos : chaque bouton `data-video-open` porte `data-video-id` (identifiant YouTube) et, si besoin, `data-video-id-en` (version jouée quand la langue est EN). La vidéo principale est celle du haut de page.

## Avant la mise en ligne

Lire `A-COMPLETER.md` pour la liste exhaustive de ce qu'il reste à remplir
par Achille (statut juridique, hébergeur, vidéo démo, formulaire en ligne,
domaine, etc.).
