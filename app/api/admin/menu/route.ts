import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const items = await prisma.menuItem.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
        })
        return NextResponse.json(items)
    } catch (error) {
        console.error('GET /api/admin/menu error:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const item = await prisma.menuItem.create({ data: body })
        return NextResponse.json(item)
    } catch (error) {
        console.error('POST /api/admin/menu error:', error)
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
    }
}