# React + TypeScript + Vite

## SEO and static public HTML

Run `npm run build` (not `vite build` alone) to build the client and pre-render `/`, `/card`, `/guide`, `/guide/scoring`, `/about`, `/privacy`, and `/terms`. The public copy and guides use the same React components in the static HTML and interactive app. The editor, saved builds, OCR, account state and live home widgets still load in the browser; they are not executed at build time. This uses `createRoot`, not hydration: static introductory content is replaced by the full app once JavaScript loads.

`src/seo/pages.ts` owns page titles, descriptions and canonical URLs. `PageSeo.tsx` updates them on client navigation. All supported `/card/:characterId` editor URLs and query variants canonicalize to `/card`; they are not independent character build articles. `/characters` and public board routes retain indexable app shells and are outside this first content pass. Profile, editing and developer tools use a separate noindex shell. Do not put them in the sitemap.

`vercel.json` routes the static public pages and known app routes explicitly, preserves static assets, and returns a 404 page/status for other paths. When adding a character, update its `/card/(...)` rule; the build checks that every current character has a working direct URL. When adding another app route or public page, update the routing rules, metadata and sitemap as appropriate. Vite's dev/preview servers do not reproduce Vercel's HTTP routing/status rules.

After building, run `npm run test:seo`. It checks the generated HTML, sitemap, metadata, canonical aliases, static assets and hosting route configuration. Existing score regression coverage is in `node --test tests/crit-rate-score.test.cjs`.

Before release, verify the deployment's actual response codes and direct navigation for `/`, `/card`, `/card/rover_spectro`, `/guide`, `/guide/scoring`, `/characters`, `/board`, `/profile`, `/dev/ocr`, and an unknown path. Confirm the Vercel build command includes the prerender step and that `www` and apex hosts redirect consistently to the chosen canonical host `https://wuwa.dev`. This change does not alter domain settings or deploy the site.

After release, inspect the four priority URLs in Search Console: rendered content, selected canonical, index status and live URL test. Submit `/sitemap.xml`. Compare the 28 completed days before and after deployment, recording deployment time in Asia/Seoul and using the same Search Console filters. Compare query + landing page impressions, clicks, CTR and average position; new pages/low counts need a longer observation period. User-supplied October visits were `명조 스펙 사이트` 13, `명조 에코 세팅 사이트` 9 and `명조 스펙` 7; these are observed visits, not estimated search volume. Other keyword ideas remain unverified candidates.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Vercel routing configuration](https://vercel.com/docs/build-output-api/v3/configuration).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
