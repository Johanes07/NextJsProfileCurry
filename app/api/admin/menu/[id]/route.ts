import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT update
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const item = await prisma.menuItem.update({
            where: { id },
            data: body,
        })
        return NextResponse.json(item)
    } catch (error) {
        console.error('PUT /api/admin/menu/[id] error:', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

// DELETE
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.menuItem.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/admin/menu/[id] error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}