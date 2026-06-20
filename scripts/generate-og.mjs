// Generates properly-sized (1200x630) Open Graph images by compositing the
// existing brand + game assets onto a branded canvas. Runs as a prebuild/predev
// step so Discord/Twitter/etc. link previews never trip the "image too small /
// wrong ratio" warning.
//
// Outputs:
//   public/images/og/site.png            — branded site card (home, games, ...)
//   public/images/og/games/<name>.png    — one per game cover in public/images/games
//
// Run:  node scripts/generate-og.mjs

import sharp from "sharp";
import { readdir, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const PUB = path.join(root, "public");
const OG_DIR = path.join(PUB, "images", "og");
const GAMES_OG_DIR = path.join(OG_DIR, "games");

const W = 1200;
const H = 630;
const BRAND = "#fe2c00";

async function exists(p) {
    try {
        await readFile(p);
        return true;
    } catch {
        return false;
    }
}

// Branded background: dark vertical gradient + accent bar.
function backgroundSvg() {
    return Buffer.from(
        `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c0500"/>
      <stop offset="55%" stop-color="#070000"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="${BRAND}"/>
</svg>`,
    );
}

// Resize an image to fit within a box, preserving aspect ratio (upscaling OK).
async function fit(imgPath, targetW, targetH) {
    return sharp(imgPath)
        .resize({
            width: targetW,
            height: targetH,
            fit: "inside",
            withoutEnlargement: false,
        })
        .toBuffer();
}

async function getMeta(buf) {
    return sharp(buf).metadata();
}

async function generateSiteOg() {
    const logoPath = path.join(PUB, "images", "logo.png");
    const bannerPath = path.join(PUB, "images", "name-banner.png");

    const layers = [{ input: await backgroundSvg(), top: 0, left: 0 }];

    // Logo centered near the top.
    if (await exists(logoPath)) {
        const logo = await fit(logoPath, 96, 96);
        const m = await getMeta(logo);
        layers.push({
            input: logo,
            top: 96,
            left: Math.round((W - m.width) / 2),
        });
    }

    // Name banner (wordmark) below the logo.
    if (await exists(bannerPath)) {
        const banner = await fit(bannerPath, 960, H);
        const m = await getMeta(banner);
        layers.push({
            input: banner,
            top: 240,
            left: Math.round((W - m.width) / 2),
        });
    }

    await mkdir(OG_DIR, { recursive: true });
    await sharp({
        create: { width: W, height: H, channels: 4, background: "#000000" },
    })
        .composite(layers)
        .png()
        .toFile(path.join(OG_DIR, "site.png"));

    console.log("og: site.png");
}

async function generateGameOg(coverPath, outPath) {
    const logoPath = path.join(PUB, "images", "logo.png");

    const layers = [{ input: await backgroundSvg(), top: 0, left: 0 }];

    // Cover art centered, scaled to a comfortable size.
    const cover = await fit(coverPath, 480, 480);
    const cm = await getMeta(cover);
    layers.push({
        input: cover,
        top: Math.round((H - cm.height) / 2),
        left: Math.round((W - cm.width) / 2),
    });

    // Small logo watermark, top-left.
    if (await exists(logoPath)) {
        const logo = await sharp(logoPath).resize(64, 64).toBuffer();
        layers.push({ input: logo, top: 40, left: 40 });
    }

    await mkdir(path.dirname(outPath), { recursive: true });
    await sharp({
        create: { width: W, height: H, channels: 4, background: "#000000" },
    })
        .composite(layers)
        .png()
        .toFile(outPath);
}

async function main() {
    await generateSiteOg();

    const gamesDir = path.join(PUB, "images", "games");
    if (existsSync(gamesDir)) {
        const files = (await readdir(gamesDir)).filter((f) =>
            /\.(png|jpe?g|webp)$/i.test(f),
        );
        for (const file of files) {
            const name = path.basename(file, path.extname(file));
            await generateGameOg(
                path.join(gamesDir, file),
                path.join(GAMES_OG_DIR, `${name}.png`),
            );
            console.log(`og: games/${name}.png`);
        }
    }

    console.log(`Done: ${W}x${H} OG images in public/images/og/`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
