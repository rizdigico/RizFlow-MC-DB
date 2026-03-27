import { NextResponse } from 'next/server'
import { getLeads, getAudits } from '../_store.js'

export async function GET() {
  try {
    const leads = await getLeads()
    const audits = await getAudits()
    const all = [...leads, ...audits].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
    const now = new Date()
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
    const pipeline = { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }
    all.forEach(l => { if (pipeline[l.status] !== undefined) pipeline[l.status]++ })
    return NextResponse.json({
      total: all.length,
      thisWeek: all.filter(l => new Date(l.receivedAt) > weekAgo).length,
      audits: audits.length,
      pipeline,
      recent: all.slice(0, 20),
      debug: {
        hasRedisUrl: !!process.env.REDIS_URL,
        leadsCount: leads.length,
        auditsCount: audits.length
      }
    })
  } catch (e) {
    return NextResponse.json({
      total: 0, thisWeek: 0, audits: 0,
      pipeline: { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 },
      recent: [],
      error: e.message,
      debug: { hasRedisUrl: !!process.env.REDIS_URL }
    })
  }
}
