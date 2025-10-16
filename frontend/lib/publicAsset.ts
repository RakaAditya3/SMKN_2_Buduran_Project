const PLACEHOLDER_IMAGE = '/images/dummyImage.jpg';
const LOCAL_MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? 'http://localhost:8000';
const SUPABASE_SEGMENT = '/storage/v1/object/public/';

const buildAbsoluteUrl = (path: string) => {
  const trimmedBase = LOCAL_MEDIA_BASE.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${normalizedPath}`;
};

export const resolvePublicImageUrl = (raw?: string | null): string => {
  if (!raw) return PLACEHOLDER_IMAGE;

  const trimmed = raw.trim();
  if (!trimmed) return PLACEHOLDER_IMAGE;

  if (/^https?:\/\//i.test(trimmed)) {
    if (trimmed.includes('public/https://')) {
      const index = trimmed.indexOf('public/https://');
      const candidate = trimmed.slice(index + 'public/'.length);
      return resolvePublicImageUrl(candidate);
    }

    if (trimmed.includes(SUPABASE_SEGMENT)) {
      const [, segment] = trimmed.split(SUPABASE_SEGMENT);
      if (segment) {
        return buildAbsoluteUrl(`storage/${segment}`);
      }
    }

    return trimmed;
  }

  let path = trimmed.replace(/^\/+/, '');

  if (path.startsWith('public/')) {
    path = path.slice('public/'.length);
  }

  if (path.startsWith('storage/')) {
    path = path.slice('storage/'.length);
  }

  return buildAbsoluteUrl(`storage/${path}`);
};
