import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await request.json()
        const child = await prisma.adminNavChild.create({
            data: {
                label: body.label,
                icon: body.icon,
                href: body.href,
                order: body.order || 0,
                parentId: id,
                isActive: true,
            }
        })
        return NextResponse.json(child)
    } catch {
        return NextResponse.json({ error: 'Failed to create child' }, { status: 500 })
    }
}