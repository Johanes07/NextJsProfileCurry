import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT = {
    badge: 'Our Information',
    headingLine1: 'VISIT US',
    headingLine2: 'ANYTIME',
    locationLines: ['Jl. Kuliner No. 1', 'Jakarta Selatan, 12345'],
    hoursLines: ['Mon – Fri: 11:00 AM – 10:00 PM', 'Sat – Sun: 10:00 AM – 11:00 PM'],
    phoneLines: ['+62 21 1234 5678', '+62 812 3456 7890'],
    emailLines: ['hello@100hourscurry.com', 'reservation@100hourscurry.com'],
}

export async function GET() {
    try {
        let record = await prisma.contactFormContent.findFirst()
        if (!record) {
            record = await prisma.contactFormContent.create({ data: DEFAULT })
        }
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json()
        let record
        if (id) {
            record = await prisma.contactFormContent.update({ where: { id }, data })
        } else {
            const existing = await prisma.contactFormContent.findFirst()
            record = existing
                ? await prisma.contactFormContent.update({ where: { id: existing.id }, data })
                : await prisma.contactFormContent.create({ data })
        }
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }
}