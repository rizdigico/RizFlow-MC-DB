import { NextResponse } from 'next/server'

// Store leads in a JSON file that the dashboard can read
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), '.next', 'leads.json')

function loadLeads() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }
  catch { return { leads: [], audits: [] } }
}

function saveLeads(data) {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(data)) } catch {}
}

export async function POST(request) {
  try {
    const data = await request.json()
    const store = loadLeads()
    const lead = {
      ...data, type: 'contact', receivedAt: new Date().toISOString(),
      status: 'new', id: `c-${Date.now()}`
    }
    store.leads.push(lead)
    saveLeads(store)
    return new NextResponse(JSON.stringify({ success: true, lead }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://rizflow.co', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    })
  } catch (e) {
    return new NextResponse(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: { 'Access-Control-Allow-Origin': 'https://rizflow.co' } })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: { 'Access-Control-Allow-Origin': 'https://rizflow.co', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
