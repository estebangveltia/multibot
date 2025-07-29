import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { nombre, contenido, tenantId } = await request.json()

    if (!nombre || !contenido || !tenantId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const contexto = await prisma.contexto.create({
      data: { nombre, contenido, tenantId }
    })

    return NextResponse.json(contexto)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creating contexto' },
      { status: 500 }
    )
  }
}
