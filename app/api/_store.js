// Shared in-memory store for Vercel serverless functions
// Persists across warm function invocations within the same container

if (!globalThis.__rizflow_store) {
  globalThis.__rizflow_store = { leads: [], audits: [] }
}

export const store = globalThis.__rizflow_store
