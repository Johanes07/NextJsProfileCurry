// app/api/admin/menu/hero/route.ts

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── GET ──────────────────────────────────────────────────────
export async function GET() {
    try {
        let data = await prisma.menuHeroContent.findFirst()

        if (!data) {
            data = await prisma.menuHeroContent.create({
                data: {}
            })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('[MENU_HERO_GET]', error)
        return NextResponse.json({ error: 'Failed to fetch menu hero content' }, { status: 500 })
    }
}

// ── PUT ──────────────────────────────────────────────────────
export async function PUT(req: Request) {
    try {
        const body = await req.json()

        const {
            id,
            badgeText,
            headingLine1,
            headingLine2,
            subtitle,
            imageUrl,
        } = body

        let data

        if (id) {
            data = await prisma.menuHeroContent.update({
                where: { id },
                data: {
                    badgeText,
                    headingLine1,
                    headingLine2,
                    subtitle,
                    imageUrl,
                }
            })
        } else {
            // upsert: find first or create
            const existing = await prisma.menuHeroContent.findFirst()
            if (existing) {
                data = await prisma.menuHeroContent.update({
                    where: { id: existing.id },
                    data: {
                        badgeText,
                        headingLine1,
                        headingLine2,
                        subtitle,
                        imageUrl,
                    }
                })
            } else {
                data = await prisma.menuHeroContent.create({
                    data: {
                        badgeText,
                        headingLine1,
                        headingLine2,
                        subtitle,
                        imageUrl,
                    }
                })
            }
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('[MENU_HERO_PUT]', error)
        return NextResponse.json({ error: 'Failed to update menu hero content' }, { status: 500 })
    }
}