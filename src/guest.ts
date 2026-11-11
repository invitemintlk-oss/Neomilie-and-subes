// Guest personalisation helpers shared by the admin page and the invitation.

export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

const RESERVED_PATHS = new Set(['admin', 'index.html']);

/**
 * Combines the selected prefix and guest name into the name shown to the guest.
 * "Dear" is a message-style option: it adds nothing to the name, because the
 * greeting already starts with "Dear" (avoids "Dear Dear Sanjaya").
 */
export function buildDisplayName(prefix: Prefix | string, rawName: string): string {
  const name = rawName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  switch (prefix) {
    case 'Family':
      return `${name} and Family`;
    case 'Dear':
      return name;
    default:
      return `${prefix} ${name}`;
  }
}

/** `{baseURL}/{displayName}` with the name safely URL-encoded (spaces, &, etc.). */
export function buildInviteLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

/**
 * Reads the personalised guest name from the current URL.
 * Supports the path form (/Mr.%20Sanjaya) and the older query form (?prefix=Mr.&name=Sanjaya).
 */
export function getGuestDisplayName(): string | null {
  if (typeof window === 'undefined') return null;

  const segment = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (segment && !RESERVED_PATHS.has(segment.toLowerCase())) {
    try {
      const decoded = decodeURIComponent(segment).replace(/\s+/g, ' ').trim();
      if (decoded) return decoded.slice(0, 120);
    } catch {
      // malformed encoding — fall through to query params
    }
  }

  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  if (name && name.trim()) {
    return buildDisplayName(params.get('prefix') || 'Dear', name).slice(0, 120);
  }
  return null;
}
