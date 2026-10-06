/** Builds an unsigned JWT whose payload carries the given expiry (seconds from now). */
export function fakeToken(expiresInSeconds: number): string {
  const encode = (value: object) => btoa(JSON.stringify(value))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  return `${encode({alg: 'none', typ: 'JWT'})}.${encode({exp})}.signature`;
}
