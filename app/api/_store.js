import Redis from 'ioredis'

function createRedis() {
  return new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    connectTimeout: 5000,
    enableReadyCheck: false,
    lazyConnect: false,
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

async function parseBody(text) {
  return JSON.parse(text)
}

export async function getLeads() {
  return withRedis(async (redis) => {
    const items = await redis.lrange('rizflow:leads', 0, -1)
    return items.map(i => JSON.parse(i))
  })
}

export async function getAudits() {
  return withRedis(async (redis) => {
    const items = await redis.lrange('rizflow:audits', 0, -1)
    return items.map(i => JSON.parse(i))
  })
}

export async function addLead(lead) {
  return withRedis(async (redis) => {
    await redis.lpush('rizflow:leads', JSON.stringify(lead))
    return lead
  })
}

export async function addAudit(audit) {
  return withRedis(async (redis) => {
    await redis.lpush('rizflow:audits', JSON.stringify(audit))
    return audit
  })
}
