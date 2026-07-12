export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDateTime(isoString) {
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return isoString
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

export function formatDate(isoString) {
  // dob comes back as YYYY-MM-DD; construct in a TZ-safe way.
  const [year, month, day] = isoString.split('-').map(Number)
  if (!year || !month || !day) return isoString
  const d = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(d)
}

export function formatPercent(fraction, digits = 1) {
  return `${(fraction * 100).toFixed(digits)}%`
}

export function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n)
}

export function ageFromDob(dobIso) {
  const [year, month, day] = dobIso.split('-').map(Number)
  if (!year) return null
  const dob = new Date(year, month - 1, day)
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const hasHadBirthdayThisYear =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate())
  if (!hasHadBirthdayThisYear) age -= 1
  return age
}
