import { defineCollection } from "astro/content/config";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const games = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/games" }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    url: z.string().url(),
    platform: z.enum(["google-drive", "itch", "browser"]),
    featured: z.boolean().default(false),
    youtubeId: z.string().optional(),
    description: z.string().optional(),
  }),
});

const tutorial = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/tutorial" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { games, tutorial };
