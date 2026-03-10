import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// GET – fetch current about hero content
export async function GET() {
    try {
        let data = await (prisma as any).aboutHeroContent.findFirst()

        // Seed default if none exists
        if (!data) {
            data = await (prisma as any).aboutHeroContent.create({
                data: {
                    badgeText: 'OUR STORY',
                    headingLine1: 'ABOUT',
                    headingLine2: '100HOURS',
                    description:
                        'Born from obsession. Driven by flavor. We believe the best things in life — and curry — cannot be rushed.',
                    imageUrl: '/images/MAINDISH/AI8.png',
                },
            })
        }

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            },
        })
    } catch (error) {
        console.error('[ABOUT_HERO_GET]', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

// PUT – update about hero content (JSON fields only)
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json()
        const { badgeText, headingLine1, headingLine2, description, imageUrl } = body

        let existing = await (prisma as any).aboutHeroContent.findFirst()

        let data
        if (existing) {
            data = await (prisma as any).aboutHeroContent.update({
                where: { id: existing.id },
                data: {
                    ...(badgeText !== undefined && { badgeText }),
                    ...(headingLine1 !== undefined && { headingLine1 }),
                    ...(headingLine2 !== undefined && { headingLine2 }),
                    ...(description !== undefined && { description }),
                    ...(imageUrl !== undefined && { imageUrl }),
                },
            })
        } else {
            data = await (prisma as any).aboutHeroContent.create({
                data: { badgeText, headingLine1, headingLine2, description, imageUrl },
            })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('[ABOUT_HERO_PUT]', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}