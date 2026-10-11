# Reel movie app inside Meshup

1. Copy `App.tsx`, `package.json`, `src/` and `__tests__/` over your Meshup project.
2. Put your TMDB key in `src/config.ts` (https://www.themoviedb.org/settings/api).
3. Install:
   ```
   npm install
   cd ios && bundle exec pod install && cd ..   # iOS only
   ```
4. Run: `npm start`, then `npm run android` or `npm run ios`.

Icons are plain text glyphs, so no native font linking is needed.
