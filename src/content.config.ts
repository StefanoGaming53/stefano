import { defineCollection } from "astro/content/config";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const games = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/games" }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    url: z.string().url().optional(),
    description: z.string().optional(),
    releaseDate: z.string().optional(),
    // When set, the game is served from a themed /downloads/[slug] page
    // with this file as the direct download (e.g. "/downloads/acceptance.exe").
    downloadFile: z.string().optional(),
  }),
});

const featured = defineCollection({
  loader: glob({ pattern: "featured.md", base: "./src/data" }),
  schema: z.object({
    games: z.array(
      z.object({
        url: z.string().url(),
        youtubeId: z.string(),
      }),
    ),
  }),
});

const tutorial = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/tutorial" }),
  schema: z.object({
    title: z.string(),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/about" }),
  schema: z.object({
    title: z.string(),
  }),
});

const links = defineCollection({
  loader: glob({ pattern: "links.md", base: "./src/data" }),
  schema: z.object({
    links: z.array(
      z.object({
        title: z.string(),
        url: z.string().url(),
        color: z.string(),
      }),
    ),
  }),
});

export const collections = { games, featured, tutorial, about, links };
