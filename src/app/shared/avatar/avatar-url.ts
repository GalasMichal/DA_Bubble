/** Lokales Standard-Profilbild (kein CDN). */
export const DEFAULT_AVATAR_URL =
  '/assets/media/icons/profile-icons/profile-icon.svg';

/** Leere, relative oder kaputte Pfade → Standard-Avatar. */
export function resolveAvatarUrl(url?: string | null): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) {
    return DEFAULT_AVATAR_URL;
  }
  if (trimmed.startsWith('./assets/')) {
    return trimmed.slice(1);
  }
  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }
  return trimmed;
}

export function onAvatarImageError(event: Event): void {
  const img = event.target as HTMLImageElement | null;
  if (!img) {
    return;
  }
  const fallback = DEFAULT_AVATAR_URL;
  if (!img.src.endsWith('profile-icon.svg')) {
    img.src = fallback;
  }
}
