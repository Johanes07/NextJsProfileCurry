import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()
        const post = await prisma.sosmedPost.update({ where: { id }, data: body })
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.sosmedPost.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}