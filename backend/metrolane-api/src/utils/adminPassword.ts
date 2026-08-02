/**
 * Administrator accounts are required (by convention, not by a silent
 * server-side transformation) to type "metrolane" plus at least one other
 * letter as part of their real password. This just verifies that convention
 * was followed — the password is hashed and compared as typed.
 */
export function hasMetrolanePepper(password: string): boolean {
  const match = password.match(/metrolane/i)
  if (!match || match.index === undefined) return false

  const remainder = password.slice(0, match.index) + password.slice(match.index + match[0].length)
  return /[a-zA-Z]/.test(remainder)
}
