/**
 * The production security headers in `vercel.json` (TODO-116).
 *
 * The refresh token lives in localStorage, so an XSS bug is a stolen
 * long-lived credential; the CSP is what keeps an injected script from running
 * at all. Two ways it silently breaks, both pinned here:
 *
 *   - The theme script inline in `index.html` is allowed by its SHA-256 hash.
 *     Edit that script and the hash stops matching: the browser blocks it and
 *     dark mode flashes light on every load, with no error anyone sees.
 *   - The bearer-token-free third parties (map tiles, geocoding) and the API
 *     must stay in `connect-src`, or the map and the whole live app fail.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface VercelConfig {
  headers: { source: string; headers: { key: string; value: string }[] }[];
}

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as VercelConfig;
const all = vercel.headers.find((h) => h.source === '/(.*)')?.headers ?? [];
const header = (key: string) => all.find((h) => h.key === key)?.value ?? '';
const csp = header('Content-Security-Policy');

describe('vercel.json security headers', () => {
  it('allows every inline script in index.html by its exact hash', () => {
    const html = readFileSync('index.html', 'utf8');
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1] ?? '');
    expect(inline.length).toBeGreaterThan(0);
    for (const body of inline) {
      const hash = createHash('sha256').update(body).digest('base64');
      expect(csp, 'index.html inline script changed: update its hash in vercel.json').toContain(
        `'sha256-${hash}'`,
      );
    }
  });

  it('never allows arbitrary inline or eval-ed script', () => {
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? '';
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  it('keeps the hosts the app genuinely calls', () => {
    for (const host of ['https://*.run.app', 'https://tiles.openfreemap.org', 'https://photon.komoot.io']) {
      expect(csp).toContain(host);
    }
  });

  it('refuses framing and pins HTTPS', () => {
    expect(csp).toContain("frame-ancestors 'none'");
    expect(header('X-Frame-Options')).toBe('DENY');
    expect(header('Strict-Transport-Security')).toContain('max-age=');
    expect(header('X-Content-Type-Options')).toBe('nosniff');
  });
});
