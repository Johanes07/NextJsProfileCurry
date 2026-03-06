import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({
            where: { isActive: true },
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        })
        return NextResponse.json(items)
    } catch (error) {
        console.error('GET /api/website/menu error:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}