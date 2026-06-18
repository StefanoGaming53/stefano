# Banners Data Guide

Reference for `src/data/banners.json` — the file that drives the site banner
shown at the top of every page (above the header).

---

## How it works

- The file is a JSON object with a single top-level `banners` array.
- On every page load, the first banner whose schedule is **currently active**
  is rendered. Only **one** banner shows at a time.
- If no banner is active, nothing is shown.
- Banner matching is evaluated in **array order** — if two banners' schedules
  overlap, the one listed **first** wins.

```json
{
  "banners": [
    { ...banner object... },
    { ...banner object... }
  ]
}
```

> ⚠️ It's strict JSON: **no comments**, **no trailing commas**, **double quotes
> only** for strings and keys.

---

## Field reference

| Field       | Type     | Required | Default       | Applies to  | Description                                                                 |
| ----------- | -------- | -------- | ------------- | ----------- | --------------------------------------------------------------------------- |
| `title`     | string   | ✅ yes   | —             | all         | Internal label only. **Not displayed** on the site — for your own reference. |
| `date`      | string   | ✅ yes   | —             | all         | When the banner starts. Format depends on `repeat` (see below).            |
| `repeat`    | string   | ❌ no    | one-time      | all         | `"yearly"` for a recurring annual banner; anything else (or omitted) = one-time. |
| `type`      | string   | ❌ no    | `"static"`    | all         | `"marquee"` (scrolling) or `"static"` (centered, non-moving). Anything other than `"marquee"` falls back to static. |
| `text`      | string   | ✅ yes   | —             | all         | The message shown. Supports emoji and Unicode. HTML tags are **not** rendered (they're escaped). |
| `bgColor`   | string   | ❌ no    | `"#fe2c00"`   | all         | Background color (hex, e.g. `"#FF0000"`). Any valid CSS color works.       |
| `textColor` | string   | ❌ no    | `"#ffffff"`   | all         | Text color (hex).                                                          |
| `duration`  | number   | ❌ no    | `1`           | all         | How many **days** the banner stays active, starting at `date`.             |
| `speed`     | number   | ❌ no    | `18`          | marquee only | Seconds for **one full scroll loop**. Lower = faster.                      |

---

## Dates & scheduling

### `date` format

The format depends on `repeat`:

| `repeat`      | `date` format | Example        | Meaning                              |
| ------------- | ------------- | -------------- | ------------------------------------ |
| `"yearly"`    | `MM-DD`       | `"06-16"`      | Recurs every year on that month/day  |
| anything else | `YYYY-MM-DD`  | `"2026-06-18"` | Single occurrence on that exact date |

### Active window

- The banner becomes active at **local midnight (00:00:00)** on `date`.
- It stays active for `duration` days and turns off at midnight after the last day.
- The window is **half-open**: active while `now >= start AND now < end`.

So `date: "06-18"` + `duration: 1` = visible for all of June 18 (local), gone on June 19.

### Multi-day example

A week-long banner starting June 18:

```json
{
  "title": "Launch Week",
  "date": "2026-06-18",
  "repeat": "none",
  "duration": 7,
  "type": "static",
  "text": "🚀 New game out now!",
  "bgColor": "#fe2c00"
}
```

---

## Banner types

### `"marquee"` — scrolling text

- Text scrolls horizontally across the full width and **loops seamlessly**.
- The text is **auto-repeated** to fill any viewport width — you only write it once.
- Hovering **pauses** the scroll.
- Use `speed` to control pace. It's the number of **seconds per full loop**:
  - `18` (default) — comfortable reading pace
  - `30`+ — slow
  - `5`–`10` — quick
  - `1` — extremely fast (probably too fast to read)

### `"static"` — centered, non-moving

- Text is centered in a full-width bar.
- Good for short, important one-off messages.

---

## Examples

### Yearly marquee (birthday / anniversary)

```json
{
  "title": "Stefano's Birthday",
  "date": "06-16",
  "repeat": "yearly",
  "type": "marquee",
  "text": "🎉🎉 HAPPY BIRTHDAY STEFANO!! 🎉🎉",
  "bgColor": "#FF0000",
  "textColor": "#FFFFFF"
}
```

### One-time static announcement

```json
{
  "title": "Site maintenance",
  "date": "2026-07-04",
  "type": "static",
  "text": "Maintenance tonight 10pm–12am EST"
}
```

### Slow marquee, custom colors

```json
{
  "title": "New release",
  "date": "12-01",
  "repeat": "yearly",
  "type": "marquee",
  "text": "★ Winter Update is live ★",
  "bgColor": "#0a3d62",
  "textColor": "#f6b93b",
  "speed": 25
}
```

---

## Gotchas

- **Only one banner shows.** If multiple are active at once, the **first** in the
  array wins. Put higher-priority banners earlier in the list.
- **No banner = nothing renders.** Outside every scheduled window, the bar is empty.
- **HTML in `text` won't work** — it's escaped and shown literally. Use emoji/Unicode
  for decoration instead of markup.
- **`speed` is seconds, lower is faster** — it's easy to set `1` by accident and get
  an unreadable blur. ~15–25 is a good range for most text.
- **`repeat` only has two real behaviors:** `"yearly"` does exactly that; any other
  value (including omitting it) is treated as one-time.
- **Times are local.** The visitor's own clock/timezone determines what's "active."
- **Strict JSON:** no comments, no trailing commas, double quotes only.

---

## Quick template

Copy, fill in, paste into the `banners` array:

```json
{
  "title": "",
  "date": "",
  "repeat": "yearly",
  "type": "marquee",
  "text": "",
  "bgColor": "#fe2c00",
  "textColor": "#ffffff",
  "duration": 1,
  "speed": 18
}
```
