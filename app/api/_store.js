import Redis from 'ioredis'

let redis = null

export function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })
  }
  return redis
}

export async function getLeads() {
  const data = await getRedis().get('rizflow:leads')
  return data ? JSON.parse(data) : []
}

export async function getAudits() {
  const data = await getRedis().get('rizflow:audits')
  return data ? JSON.parse(data) : []
}

export async function addLead(lead) {
  const leads = await getLeads()
  leads.push(lead)
  await getRedis().set('rizflow:leads', JSON.stringify(leads))
  return lead
}

export async function addAudit(audit) {
  const audits = await getAudits()
  audits.push(audit)
  await getRedis().set('rizflow:audits', JSON.stringify(audits))
  return audit
}
