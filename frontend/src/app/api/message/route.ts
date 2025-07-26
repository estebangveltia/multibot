import { NextResponse } from 'next/server'

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:8000'

export async function POST(req: Request) {
  try {
    const { tenant, sender, message } = await req.json()
    if (!tenant || !sender || !message) {
      return NextResponse.json({ error: 'tenant, sender and message are required' }, { status: 400 })
    }
    const url = `${GATEWAY_URL}/webhook/${encodeURIComponent(tenant)}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, message }),
    })
    const text = await resp.text()
    let data
    try { data = JSON.parse(text) } catch { data = text }
    return NextResponse.json({ ok: resp.ok, status: resp.status, data }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'unknown error' }, { status: 500 })
  }
}
