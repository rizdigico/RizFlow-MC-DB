import Redis from 'ioredis'

function createRedis() {
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
    enableReadyCheck: false,
  })
}

async function withRedis(fn) {
  const redis = createRedis()
  try {
    return await fn(redis)
  } finally {
    redis.disconnect()
  }
}

// Ensures the key is a List type, migrating from String if needed
async function ensureList(redis, key) {
  const type = await redis.type(key)
  if (type === 'string') {
    // Migrate: read the old JSON array, delete the key, re-store as list
    const raw = await redis.get(key)
    await redis.del(key)
    if (raw) {
      try {
        const items = JSON.parse(raw)
        if (Array.isArray(items) && items.length > 0) {
          // Push in reverse so newest is first
          for (let i = items.length - 1; i >= 0; i--) {
            await redis.lpush(key, JSON.stringify(items[i]))
          }
        }
      } catch {}
    }
  }
}

export async function getLeads() {
  return withRedis(async (redis) => {
    await ensureList(redis, 'rizflow:leads')
    const items = await redis.lrange('rizflow:leads', 0, -1)
    return items.map(i => JSON.parse(i))
  })
}

export async function getAudits() {
  return withRedis(async (redis) => {
    await ensureList(redis, 'rizflow:audits')
    const items = await redis.lrange('rizflow:audits', 0, -1)
    return items.map(i => JSON.parse(i))
  })
}

export async function addLead(lead) {
  return withRedis(async (redis) => {
    await ensureList(redis, 'rizflow:leads')
    await redis.lpush('rizflow:leads', JSON.stringify(lead))
    return lead
  })
}

export async function addAudit(audit) {
  return withRedis(async (redis) => {
    await ensureList(redis, 'rizflow:audits')
    await redis.lpush('rizflow:audits', JSON.stringify(audit))
    return audit
  })
}
