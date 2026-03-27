import { NextResponse } from 'next/server'
import fs from 'fs'

const AUDITS_DIR = '/tmp/clients/audits'

export async function POST(request) {
  try {
    const data = await request.json()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `audit-${timestamp}-${data.email || 'unknown'}.json`
    
    const lead = {
      ...data,
      type: 'audit',
      receivedAt: new Date().toISOString(),
      status: 'new',
      score: null,
      assignedTo: null
    }
    
    fs.mkdirSync(AUDITS_DIR, { recursive: true })
    fs.writeFileSync(`${AUDITS_DIR}/${filename}`, JSON.stringify(lead, null, 2))
    
    console.log(`[WEBHOOK] New audit: ${data.name} (${data.email}) from ${data.agency}`)
    
    return new NextResponse(JSON.stringify({ success: true, message: 'Audit request received', leadId: filename }), {
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
