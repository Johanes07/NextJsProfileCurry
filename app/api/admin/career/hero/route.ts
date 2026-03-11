import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT = {
    badgeText: 'JOIN THE TEAM',
    headingLine1: 'WORK WITH',
    headingLine2: 'US',
    subtitle: 'Be part of something obsessive. We are always looking for passionate people who love food as much as we do.',
    imageUrl: '/images/chef.jpg',
}

export async function GET() {
    try {
        let record = await prisma.careerHeroContent.findFirst()
        if (!record) {
            record = await prisma.careerHeroContent.create({ data: DEFAULT })
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
            record = await prisma.careerHeroContent.update({ where: { id }, data })
        } else {
            const existing = await prisma.careerHeroContent.findFirst()
            record = existing
                ? await prisma.careerHeroContent.update({ where: { id: existing.id }, data })
                : await prisma.careerHeroContent.create({ data })
        }
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }
}