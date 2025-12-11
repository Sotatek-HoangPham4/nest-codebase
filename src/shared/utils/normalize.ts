/**
 * Normalize IPv4 / IPv6 loopback and proxy formats.
 *
 * Why:
 *  - Express `req.ip` may return "::1", "::ffff:127.0.0.1", or "127.0.0.1"
 *  - Without normalization, IP comparison will produce false positives
 *    and incorrectly trigger device-mismatch security checks.
 */
export function normalizeIp(ip: string) {
  if (!ip) return '';

  // IPv6 loopback → normalize to IPv4 loopback
  if (ip === '::1' || ip === '0:0:0:0:0:0:0:1') return '127.0.0.1';

  // When behind proxies or running on Windows, Express may return "::ffff:127.0.0.1"
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');

  return ip;
}

/**
 * Normalize User-Agent for comparison.
 *
 * Why:
 *  - Full UA strings change frequently (browser auto-update, OS patches)
 *  - Keeping the entire UA causes false-positive device mismatch detection
 *  - Using only the stable prefix (e.g., "Mozilla/5.0", "Chrome/121.0.1")
 *    maintains security while preventing unnecessary session invalidation.
 */
export function normalizeUserAgent(ua: string = '') {
  return ua.split(' ').slice(0, 2).join(' ');
}
