import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ childId: string }> }) {
    try {
        const { childId } = await params
        const body = await request.json()
        const child = await prisma.adminNavChild.update({
            where: { id: childId },
            data: {
                label: body.label,
                icon: body.icon,
                href: body.href,
                order: body.order ?? 0,
                isActive: body.isActive ?? true,
            }
        })
        return NextResponse.json(child)
    } catch {
        return NextResponse.json({ error: 'Failed to update child' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ childId: string }> }) {
    try {
        const { childId } = await params
        await prisma.adminNavChild.delete({ where: { id: childId } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 })
    }
}