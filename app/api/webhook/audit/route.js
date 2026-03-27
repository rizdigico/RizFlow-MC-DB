import { NextResponse } from 'next/server'
import { store } from '../_store.js'

export async function POST(request) {
  try {
    const data = await request.json()
    const audit = {
      ...data,
      type: 'audit',
      receivedAt: new Date().toISOString(),
      status: 'new',
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }
    store.audits.push(audit)
    console.log(`[WEBHOOK] Audit: ${data.name} | Total: ${store.audits.length}`)
    return new NextResponse(JSON.stringify({ success: true, message: 'Audit received', leadId: audit.id }), {
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
