import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── GET ───────────────────────────────────────────────────────────────────
export async function GET() {
    try {
        let meta = await prisma.teamSectionMeta.findFirst()
        if (!meta) meta = await prisma.teamSectionMeta.create({ data: {} })

        return NextResponse.json({ success: true, meta })
    } catch (error) {
        console.error('[team GET]', error)
        return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
    }
}

// ── POST ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const { meta } = await req.json()

        const existing = await prisma.teamSectionMeta.findFirst()
        if (existing) {
            await prisma.teamSectionMeta.update({ where: { id: existing.id }, data: meta })
        } else {
            await prisma.teamSectionMeta.create({ data: meta })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[team POST]', error)
        return NextResponse.json({ success: false, message: 'Gagal menyimpan data' }, { status: 500 })
    }
}