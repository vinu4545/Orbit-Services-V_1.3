# Orbit Services — Intelligent Automation for Modern Businesses

**orbitservices.tech**

Welcome to the Orbit Services website repository — a polished, Framer-exported static site showcasing a startup that builds intelligent automation, web platforms, and technical systems for modern businesses. This repo contains the full static site, creative assets, and lightweight JS modules used to render interactive UI and premium visuals.

---

## 🚀 Live Demo (Deployed)

Visit the live site: **https://orbitservices.tech**

This deployment mirrors the exported site in this repository and demonstrates the final visual design, animated starfield background, and media-driven hero sections.

---

## ✨ What This Project Is About

Orbit Services is a startup focused on automating business processes and building technical systems that scale. This website acts as the public-facing brochure for the company — highlighting services, case studies, and the team approach.

Key highlights:
- Product-led messaging emphasizing automation-first design
- Full-screen animated starfield background implemented in vanilla JS/CSS
- Media-rich sections (videos/images) that preserve pixel-perfect layout
- Lightweight, framework-free static export suitable for simple hosting

---

## 🔎 Repository Structure

- `/index.html`, `/about.html`, `/services.html`, `/projects.html`, `/contact.html` — main pages
- `/assets/` — JS modules, CSS bundles, images, and videos used by the site
- `/__l5e/` — small runtime helpers and event SDK artifacts
- `assets/*.js` — generated modules that mount the page content

---

## 🎯 Goals & Design Principles

- Preserve visual parity with the original design exported from the builder
- Keep layout, spacing, and component positioning identical across changes
- Implement interactive visuals (starfield, media) without external frameworks
- Make the static site easy to host (Netlify, Vercel, Cloudflare Pages, any static host)

---

## 🛠️ Local Preview (Simple)

To preview the site locally, serve the project directory with any static server. For example, using Python:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

Or using Node's `serve` package:

```bash
npm install -g serve
serve -p 8080 .
```

---

## 📦 Development Notes

- The site is a static export; editing generated `assets/*.js` files can change rendered content. Prefer editing source components if available in your design tooling and re-exporting.
- Media replacements (image → video) are implemented carefully to avoid layout shifts — `media-replacement` CSS ensures `object-fit: cover` and `width/height:100%`.
- The starfield background is implemented in `assets/starfield.js` and styled via `assets/starfield.css`.
- Defensive CSS/inline scripts have been added to remove any builder-specific edit badges during public hosting.

---

## ✅ How to Contribute

- Fork the repo and open a PR with clear changes and screenshots if visual.
- Keep changes focused — avoid modifying layout scaffolding unless the goal is a direct visual update.
- If you add large media files, consider storing them externally or using optimized formats to keep the repo size manageable.

---

## 📣 Release & Deploy

This repo is ready to be deployed to any static host. Typical steps on a platform like Vercel/Netlify/Cloudflare Pages:

- Connect your GitHub repo
- Pick the root directory (project root)
- Deploy (no build step required for the static HTML)

---

## 📬 Contact

- Official site: https://orbitservices.tech
- Email: support.orbitservices@gmail.com
- Phone: +91 8010705057

---

## ⚖️ License

This repository is provided as-is. If you're publishing or reusing assets, ensure you have rights to the media and any third-party fonts or graphics used in the project.

---

Thank you for checking out Orbit Services — ship reliable automation, faster.