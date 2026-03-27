import { NextResponse } from 'next/server'
import { addAudit } from '../_store.js'

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
    await addAudit(audit)
    return new NextResponse(JSON.stringify({ success: true, audit }), {
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
