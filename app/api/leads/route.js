import { NextResponse } from 'next/server'

const globalStore = globalThis.__rizflow_store || { leads: [], audits: [] }
globalThis.__rizflow_store = globalStore

export async function GET() {
  try {
    const allLeads = [...globalStore.leads, ...globalStore.audits]
    allLeads.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
    
    const now = new Date()
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
    
    const pipeline = { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }
    allLeads.forEach(l => { if (pipeline[l.status] !== undefined) pipeline[l.status]++ })
    
    return NextResponse.json({
      total: allLeads.length,
      thisWeek: allLeads.filter(l => new Date(l.receivedAt) > weekAgo).length,
      audits: globalStore.audits.length,
      pipeline,
      recent: allLeads.slice(0, 20)
    })
  } catch (e) {
    return NextResponse.json({ total: 0, thisWeek: 0, audits: 0, pipeline: { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }, recent: [] })
  }
}
