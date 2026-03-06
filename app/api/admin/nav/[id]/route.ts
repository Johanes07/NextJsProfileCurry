import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const item = await prisma.adminNavItem.update({
            where: { id },
            data: {
                label: body.label,
                icon: body.icon,
                href: body.href || null,
                groupName: body.groupName || null,
                order: body.order,
                isActive: body.isActive,
            },
            include: { children: true }
        })
        return NextResponse.json(item)
    } catch {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.adminNavItem.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}