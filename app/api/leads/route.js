import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LEADS_DIR = '/tmp/clients/leads'
const AUDITS_DIR = '/tmp/clients/audits'

export async function GET() {
  try {
    const contactFiles = fs.existsSync(LEADS_DIR) ? fs.readdirSync(LEADS_DIR).filter(f => f.endsWith('.json')) : []
    const auditFiles = fs.existsSync(AUDITS_DIR) ? fs.readdirSync(AUDITS_DIR).filter(f => f.endsWith('.json')) : []
    
    const allLeads = []
    contactFiles.forEach(f => {
      try { allLeads.push(JSON.parse(fs.readFileSync(path.join(LEADS_DIR, f), 'utf8'))) } catch {}
    })
    auditFiles.forEach(f => {
      try { allLeads.push(JSON.parse(fs.readFileSync(path.join(AUDITS_DIR, f), 'utf8'))) } catch {}
    })
    
    allLeads.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
    
    const now = new Date()
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
    
    const pipeline = { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }
    allLeads.forEach(l => { if (pipeline[l.status] !== undefined) pipeline[l.status]++ })
    
    return NextResponse.json({
      total: allLeads.length,
      thisWeek: allLeads.filter(l => new Date(l.receivedAt) > weekAgo).length,
      audits: allLeads.filter(l => l.type === 'audit').length,
      pipeline,
      recent: allLeads.slice(0, 20)
    })
  } catch (e) {
    return NextResponse.json({ total: 0, thisWeek: 0, audits: 0, pipeline: { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }, recent: [] })
  }
}
