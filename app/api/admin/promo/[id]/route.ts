import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const promo = await prisma.promo.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(promo)
    } catch (error) {
        console.error('PUT /api/admin/promo/[id] error:', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.promo.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/admin/promo/[id] error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}