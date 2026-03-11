import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_DATA = {
    badgeText: 'FIND US',
    headingLine1: 'GET IN',
    headingLine2: 'TOUCH',
    subtitle: 'Have a question? Want to reserve a table? We would love to hear from you.',
    imageUrl: '/images/MAINDISH/AI3.png',
}

export async function GET() {
    try {
        let record = await prisma.contactHeroContent.findFirst()
        if (!record) {
            record = await prisma.contactHeroContent.create({ data: DEFAULT_DATA })
        }
        return NextResponse.json(record)
    } catch (error) {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json()
        const { id, ...data } = body

        let record
        if (id) {
            record = await prisma.contactHeroContent.update({
                where: { id },
                data,
            })
        } else {
            const existing = await prisma.contactHeroContent.findFirst()
            if (existing) {
                record = await prisma.contactHeroContent.update({
                    where: { id: existing.id },
                    data,
                })
            } else {
                record = await prisma.contactHeroContent.create({ data })
            }
        }

        return NextResponse.json(record)
    } catch (error) {
        return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }
}