import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT_DATA = {
    badge: 'How It All Started',
    headingLine1: 'FROM A HOME',
    headingLine2: 'KITCHEN TO',
    headingLine3: 'THE WORLD',
    paragraph1: "It started in 2020 when our founder spent an entire weekend perfecting his grandmother's curry recipe. After 100 hours of slow cooking, he discovered something magical — depth of flavor that no shortcut could ever replicate.",
    paragraph2: "What began as a passion project shared with friends quickly grew into Jakarta's most talked-about curry destination. Word spread not through ads, but through the irresistible aroma and unforgettable taste.",
    paragraph3: 'Today, we still follow the same 100-hour process. No compromises. No shortcuts. Just pure, obsessive dedication to the perfect bowl of curry.',
    stat1Value: '2020', stat1Label: 'Founded',
    stat2Value: '3', stat2Label: 'Locations',
    stat3Value: '50K+', stat3Label: 'Bowls Served',
    hoursValue: '100',
    hoursLabel1: 'Hours of dedication',
    hoursLabel2: 'in every single bowl',
    imageUrl: '/images/MAINDISH/AI1.png',
}

export async function GET() {
    try {
        let data = await (prisma as any).ourStoryContent.findFirst()
        if (!data) {
            data = await (prisma as any).ourStoryContent.create({ data: DEFAULT_DATA })
        }
        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
        })
    } catch (error) {
        console.error('[OUR_STORY_GET]', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        let existing = await (prisma as any).ourStoryContent.findFirst()
        let data
        if (existing) {
            data = await (prisma as any).ourStoryContent.update({
                where: { id: existing.id },
                data: body,
            })
        } else {
            data = await (prisma as any).ourStoryContent.create({ data: { ...DEFAULT_DATA, ...body } })
        }
        return NextResponse.json(data)
    } catch (error) {
        console.error('[OUR_STORY_PUT]', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}