export function isValidEmail(value: string) {
  const email = value.trim()
  if (email.length === 0) return false

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type PasswordRuleResult = {
  length: boolean
  lowercase: boolean
  uppercase: boolean
  number: boolean
  special: boolean
}

export function checkPasswordRules(password: string): PasswordRuleResult {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export function isStrongPassword(password: string) {
  const r = checkPasswordRules(password)
  return r.length && r.lowercase && r.uppercase && r.number && r.special
}

export function getStrongPasswordMessage(password: string) {
  if (password.length === 0) return 'Password is required.'

  const r = checkPasswordRules(password)
  if (r.length && r.lowercase && r.uppercase && r.number && r.special) return null

  if (!r.length) return 'Password must be at least 8 characters.'

  return 'Password must include uppercase, lowercase, a number, and a special character.'
}
