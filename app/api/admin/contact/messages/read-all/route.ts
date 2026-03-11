import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH() {
    try {
        await prisma.contactMessage.updateMany({
            where: { isRead: false },
            data: { isRead: true },
        })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Gagal update pesan' }, { status: 500 })
    }
}