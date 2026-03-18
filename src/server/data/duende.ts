import 'server-only';

import { cache } from 'react';
import { z } from 'zod';

import { fetchGoogleDriveData } from '@/utils/googleDriveApi';

const slideSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(''),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const aboutTextSchema = z.object({
  title: z.string().default(''),
  description: z.array(z.string()).default([]),
});

const aboutImageSchema = z.object({
  id: z.string().optional(),
  alt: z.string().default(''),
  src: z.string().min(1),
});

const rawDuendeDataSchema = z.object({
  slides: z.array(slideSchema).default([]),
  about_text: aboutTextSchema.default({ title: '', description: [] }),
  about_images: z.array(aboutImageSchema).default([]),
  email: z.string().email().nullable().optional(),
  instagram: z.string().nullable().optional(),
  behance: z.string().nullable().optional(),
  since: z.string().nullable().optional(),
});

export type GalleryPhoto = z.infer<typeof slideSchema>;

type DuendeData = {
  slides: GalleryPhoto[];
  about: {
    title: string;
    description: string[];
    images: { id: string; alt: string; src: string }[];
  };
  contact: {
    email: string | null;
    instagram: string | null;
    behance: string | null;
  };
  footer: {
    since: string;
  };
};

export type DuendeDataResult =
  | { ok: true; data: DuendeData; error: null }
  | { ok: false; data: DuendeData; error: string };

const EMPTY_DATA: DuendeData = {
  slides: [],
  about: {
    title: '',
    description: [],
    images: [],
  },
  contact: {
    email: null,
    instagram: null,
    behance: null,
  },
  footer: {
    since: '2024',
  },
};

const sanitizeExternalUrl = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
};

const normalizeData = (data: z.infer<typeof rawDuendeDataSchema>): DuendeData => ({
  slides: data.slides,
  about: {
    title: data.about_text.title,
    description: data.about_text.description,
    images: data.about_images.map((image, index) => ({
      id: image.id ?? String(index),
      alt: image.alt,
      src: image.src,
    })),
  },
  contact: {
    email: data.email ?? null,
    instagram: sanitizeExternalUrl(data.instagram),
    behance: sanitizeExternalUrl(data.behance),
  },
  footer: {
    since: data.since || '2024',
  },
});

export const getDuendeData = cache(async (): Promise<DuendeDataResult> => {
  try {
    const raw = await fetchGoogleDriveData();
    const parsed = rawDuendeDataSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        ok: false,
        data: EMPTY_DATA,
        error: 'Invalid data shape from Google Drive',
      };
    }

    return {
      ok: true,
      data: normalizeData(parsed.data),
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      data: EMPTY_DATA,
      error: error instanceof Error ? error.message : 'Unknown data fetch error',
    };
  }
});
