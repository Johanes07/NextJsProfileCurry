import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const promos = await prisma.promo.findMany({
            where: { isActive: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })
        return NextResponse.json(promos)
    } catch (error) {
        console.error('GET /api/website/promo error:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}