import { NextResponse } from 'next/server'
import fs from 'fs'

const LEADS_DIR = '/root/.openclaw/workspace/clients/leads'

export async function POST(request) {
  try {
    const data = await request.json()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `contact-${timestamp}-${data.email || 'unknown'}.json`
    
    const lead = {
      ...data,
      type: 'contact',
      receivedAt: new Date().toISOString(),
      status: 'new',
      score: null,
      assignedTo: null
    }
    
    fs.mkdirSync(LEADS_DIR, { recursive: true })
    fs.writeFileSync(`${LEADS_DIR}/${filename}`, JSON.stringify(lead, null, 2))
    
    console.log(`[WEBHOOK] New contact: ${data.name} (${data.email}) from ${data.company}`)
    
    return NextResponse.json({ success: true, message: 'Lead received', leadId: filename })
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
