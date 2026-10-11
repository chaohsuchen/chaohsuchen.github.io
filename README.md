# chaohsuchen.github.io

Personal site of **Chao-Hsu Chen** (University of Toronto, CS × MScAC). It's built around one idea: **humans and AI agents, better together.**

React + TypeScript + Vite · Framer Motion · a hand-written canvas starfield.

## Run locally

```bash
npm install
npm run dev
```

## Edit your content

Everything you’ll want to change lives in **`src/data/content.ts`**: bio, news, research projects, jobs, contests, links, email, and the questions the agents answer on the Contact page.

To add a CV, drop `cv.pdf` into `public/` and set `links.cv: '/cv.pdf'`.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

One-time setup: **GitHub repo → Settings → Pages → Build and deployment → Source: _GitHub Actions_.**

The site will be live at https://chaohsuchen.github.io.

## What's in here

| Piece | Where |
| --- | --- |
| Starfield: parallax, twinkle, shooting stars, warp jump between pages, cursor-to-star constellation links | `src/components/Starfield.tsx` |
| Warm "human light" cursor glow | `src/components/CursorGlow.tsx` |
| Byte, Chao & Pixel: heads and eyes follow the mouse, react to nav hover, click to chat | `src/components/Crew.tsx` |
| Reusable crew faces with eye tracking | `src/components/Face.tsx` |
| Pages | `src/pages/*` |

Easter egg: click the human in the middle five times, quickly.

Animations respect `prefers-reduced-motion`.
