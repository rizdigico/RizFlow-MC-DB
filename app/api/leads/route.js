import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
const DATA_FILE = path.join(process.cwd(), '.next', 'leads.json')
function loadLeads() { try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) } catch { return { leads: [], audits: [] } } }
export async function GET() {
  const store = loadLeads()
  const all = [...store.leads, ...store.audits].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  const now = new Date()
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
  const pipeline = { new: 0, contacted: 0, qualified: 0, proposal: 0, closed: 0 }
  all.forEach(l => { if (pipeline[l.status] !== undefined) pipeline[l.status]++ })
  return NextResponse.json({ total: all.length, thisWeek: all.filter(l => new Date(l.receivedAt) > weekAgo).length, audits: store.audits.length, pipeline, recent: all.slice(0, 20) })
}
