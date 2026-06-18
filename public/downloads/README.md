# Direct Download Files

Place downloadable game binaries here, e.g. `acceptance.exe`. They are served at
`/downloads/<filename>` (e.g. `/downloads/acceptance.exe`).

## How to wire up a direct download

1. Drop the file in this folder, e.g. `acceptance.exe`.
2. Edit the matching game markdown file in `src/data/games/<slug>.md` and add a
   `downloadFile` field pointing at it:

   ```md
   ---
   title: "Acceptance"
   image: "/images/games/acceptance.png"
   url: "https://stefano-gaming.itch.io/acceptance"
   description: "Acceptance - a game by Stefano Gaming"
   releaseDate: "2025-04-04"
   downloadFile: "/downloads/acceptance.exe"
   ---
   ```

3. The game card on `/games` will now link to a themed download page at
   `/downloads/<slug>` (e.g. `/downloads/acceptance`) with a big
   "Download for Windows" button that serves this file directly.

Notes:
- The file path in `downloadFile` must match the filename placed here.
- If `downloadFile` is omitted, the download page falls back to the external `url`
  (e.g. itch.io / Google Drive).
- The page route `/downloads/<slug>` and the files `/downloads/<file>.exe`
  coexist without conflict (e.g. `/downloads/acceptance` vs `/downloads/acceptance.exe`).
