// app/api/admin/nav/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const items = await prisma.adminNavItem.findMany({
            where: { isActive: true },
            include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' },
        })
        return NextResponse.json(items)
    } catch {
        return NextResponse.json([], { status: 200 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const item = await prisma.adminNavItem.create({
            data: {
                label: body.label,
                icon: body.icon,
                href: body.href || null,
                groupName: body.groupName || null,
                order: body.order || 0,
            },
            include: { children: true }
        })
        return NextResponse.json(item)
    } catch {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
    }
}