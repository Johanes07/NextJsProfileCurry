import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const promos = await prisma.promo.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
        })
        return NextResponse.json(promos)
    } catch (error) {
        console.error('GET /api/admin/promo error:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const promo = await prisma.promo.create({ data: body })
        return NextResponse.json(promo)
    } catch (error) {
        console.error('POST /api/admin/promo error:', error)
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
    }
}