import axios from 'axios'

// The FastAPI app mounts the router at prefix f"/api/{version}/prediction"
// with version = "v1" (see src/backend/__init__.py in the backend).
// We call this as a relative path so the Vite dev proxy (see vite.config.js)
// and any production reverse proxy can forward it to the backend without
// the browser needing CORS headers.
const API_BASE = '/api/v1/prediction'

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Extracts a human-readable message from a FastAPI/Pydantic error response.
 * FastAPI validation errors (422) come back as:
 *   { detail: [{ loc, msg, type }, ...] }
 * Other HTTPExceptions come back as:
 *   { detail: "some string" }
 */
export function extractErrorMessage(error) {
  if (error?.code === 'ERR_NETWORK') {
    return 'Could not reach the backend. Confirm the FastAPI server is running and reachable.'
  }

  const detail = error?.response?.data?.detail

  if (!detail) {
    return error?.message || 'Something went wrong. Please try again.'
  }

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.at(-1) : 'field'
        return `${field}: ${item.msg}`
      })
      .join(' • ')
  }

  return 'Something went wrong. Please try again.'
}
