import { NextResponse } from 'next/server'

const globalStore = globalThis.__rizflow_store || { leads: [], audits: [] }
globalThis.__rizflow_store = globalStore

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
    
    globalStore.audits.push(audit)
    console.log(`[WEBHOOK] New audit: ${data.name} (${data.email}) | Total audits: ${globalStore.audits.length}`)
    
    return new NextResponse(JSON.stringify({ success: true, message: 'Audit request received', leadId: audit.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://rizflow.co',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (e) {
    return new NextResponse(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://rizflow.co',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://rizflow.co',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
