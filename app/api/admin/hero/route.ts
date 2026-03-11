import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// ✅ Paksa Next.js tidak cache route ini
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        let hero = await prisma.heroContent.findFirst()
        if (!hero) {
            hero = await prisma.heroContent.create({
                data: {
                    badgeText: 'SIMMERED FOR 100 HOURS',
                    headingLine1: 'THE MOST',
                    headingLine2: 'LEGENDARY',
                    headingLine3: 'CURRY',
                    subtitle: "Every bowl is a masterpiece. We slow-cook our signature curry for exactly 100 hours to achieve the deepest, most complex flavors you've ever tasted.",
                    estYear: '2020',
                    stat1Value: '100', stat1Label: 'Hours Cooked', stat1Suffix: 'hrs',
                    stat2Value: '4.9', stat2Label: 'Rating', stat2Suffix: '★',
                    stat3Value: '50K+', stat3Label: 'Bowls Served', stat3Suffix: '',
                }
            })
        }
        // ✅ Header supaya browser juga tidak cache
        return NextResponse.json(hero, {
            headers: { 'Cache-Control': 'no-store' }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const hero = await prisma.heroContent.findFirst()
        const updated = hero
            ? await prisma.heroContent.update({ where: { id: hero.id }, data: body })
            : await prisma.heroContent.create({ data: body })
        return NextResponse.json(updated, {
            headers: { 'Cache-Control': 'no-store' }
        })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update hero' }, { status: 500 })
    }
}