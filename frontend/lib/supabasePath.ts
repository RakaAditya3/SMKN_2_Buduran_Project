const SUPABASE_PUBLIC_BASE = 'https://kmzmzmrdwbaaibcgqowh.supabase.co/storage/v1/object/public';

const PUBLIC_PREFIX = 'storage/v1/object/public/';

export const resolveSupabaseImageUrl = (raw?: string | null): string => {
  if (!raw) return '/images/dummyImage.jpg';

  const trimmed = raw.trim();
  if (!trimmed) return '/images/dummyImage.jpg';

  if (trimmed.startsWith('http')) {
    const doubleHttpIndex = trimmed.indexOf('/public/https://');
    if (doubleHttpIndex !== -1) {
      const corrected = trimmed.slice(doubleHttpIndex + '/public/'.length);
      return corrected;
    }
    return trimmed;
  }

  let path = trimmed.replace(/^\/+/, '');

  if (path.startsWith(PUBLIC_PREFIX)) {
    path = path.slice(PUBLIC_PREFIX.length);
  } else if (path.startsWith('public/')) {
    path = path.slice('public/'.length);
  }

  if (path.startsWith('images/')) {
    // already includes bucket
  } else if (path.startsWith('ebooks/')) {
    path = `images/${path}`;
  } else {
    path = `images/ebooks/${path}`;
  }

  return `${SUPABASE_PUBLIC_BASE}/${path}`;
};
