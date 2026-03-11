import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.jobApplication.update({ where: { id }, data: { isRead: true } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Gagal update' }, { status: 500 })
    }
}