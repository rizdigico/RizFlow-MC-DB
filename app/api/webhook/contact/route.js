import { NextResponse } from 'next/server'
import { addLead } from '../_store.js'

const allowedOrigins = ['https://rizflow.co', 'https://www.rizflow.co']

function corsHeaders(origin) {
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0]
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function POST(request) {
  try {
    const origin = request.headers.get('origin') || ''
    const data = await request.json()
    const lead = {
      ...data, type: 'contact', receivedAt: new Date().toISOString(),
      status: 'new', id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    }
    await addLead(lead)
    return new NextResponse(JSON.stringify({ success: true, lead }), {
      status: 200, headers: corsHeaders(origin)
    })
  } catch (e) {
    const origin = request.headers.get('origin') || ''
    return new NextResponse(JSON.stringify({ success: false, error: e.message }), {
      status: 400, headers: corsHeaders(origin)
    })
  }
}

export async function OPTIONS(request) {
  const origin = request.headers.get('origin') || ''
  return new NextResponse(null, { status: 200, headers: corsHeaders(origin) })
}
