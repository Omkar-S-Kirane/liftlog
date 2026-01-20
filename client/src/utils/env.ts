export function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_URL
  return typeof value === 'string' && value.length > 0 ? value : 'http://localhost:5000'
}
