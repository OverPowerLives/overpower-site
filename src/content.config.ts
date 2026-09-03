import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * News — the 89 posts imported from WordPress in Phase 1.
 *
 * Slugs come from the filename and are preserved verbatim from WordPress,
 * so /designing-overpower/ stays /designing-overpower/ and needs no redirect.
 */
const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      category: z.string().default('News'),
      tags: z.array(z.string()).default([]),
      author: z.string().default('OverPower'),
      draft: z.boolean().default(false),
      // Set only when a post's WordPress URL differed from its filename.
      legacyPath: z.string().optional(),
    }),
});

/**
 * Errata — replaces the hand-maintained anchor list on /errata/.
 *
 * `anchor` MUST carry the existing anchor id from the WordPress page so that
 * links already shared in Discord keep resolving after cutover.
 */
const errata = defineCollection({
  loader: file('./src/content/errata/errata.json'),
  schema: z.object({
    id: z.string(),
    anchor: z.string(),
    cardName: z.string(),
    cardSet: z.string(),
    slot: z.enum([
      'Character',
      'Special',
      'Mission Objective',
      'Event',
      'Universe',
      'Location',
      'Battleground',
      'Power',
    ]),
    character: z.string().optional(),
    section: z.enum(['Season 1 Errata', '2025 Rules Changes']),
    ruling: z.string(),
    effectiveDate: z.coerce.date(),
    supersedes: z.string().optional(),
  }),
});

/**
 * Play Network — the venue directory. Adding a store becomes one JSON entry
 * instead of an Elementor page edit.
 */
const venues = defineCollection({
  loader: file('./src/content/venues/venues.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string().default('USA'),
    url: z.string().url().optional(),
    schedule: z.string().optional(),
    level: z.enum(['Casual', 'Sanctioned', 'Regional']).default('Casual'),
  }),
});

export const collections = { news, errata, venues };
