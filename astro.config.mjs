// @ts-check
import { defineConfig } from "astro/config";

// Production origin, used to build absolute URLs for Open Graph / Twitter
// embed previews (Discord, Slack, iMessage, etc.). Set `SITE` at build/deploy
// time to your real domain, e.g. https://stefanogaming.com
const site = process.env.SITE || "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
  site,
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
