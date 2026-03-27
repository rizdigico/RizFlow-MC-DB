import { NextResponse } from 'next/server'
import { store } from '../_store.js'

export async function POST(request) {
  try {
    const data = await request.json()
    const lead = {
      ...data,
      type: 'contact',
      receivedAt: new Date().toISOString(),
      status: 'new',
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }
    store.leads.push(lead)
    console.log(`[WEBHOOK] Contact: ${data.name} | Total: ${store.leads.length}`)
    return new NextResponse(JSON.stringify({ success: true, message: 'Lead received', leadId: lead.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://rizflow.co', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' }
    })
  } catch (e) {
    return new NextResponse(JSON.stringify({ success: false, error: e.message }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'https://rizflow.co' } })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: { 'Access-Control-Allow-Origin': 'https://rizflow.co', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
}
