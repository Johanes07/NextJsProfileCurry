import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/footer
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
    try {
        let row = await prisma.siteSettings.findFirst()

        // Seed jika belum ada
        if (!row) {
            row = await prisma.siteSettings.create({
                data: {
                    siteName: '100Hours Curry',
                    tagline: 'Crafted with passion. Simmered for 100 hours.',
                    email: 'hello@100hourscurry.com',
                    phone: '+62 21 1234 5678',
                    address: 'Jl. Kuliner No. 1, Jakarta Selatan',
                    openHours: 'Open Daily: 11:00 AM – 10:00 PM',
                    instagramUrl: '#',
                    facebookUrl: '#',
                    youtubeUrl: '#',
                },
            })
        }

        return NextResponse.json({ success: true, data: row })
    } catch (error) {
        console.error('[FOOTER GET]', error)
        return NextResponse.json({ success: false, message: 'Failed to fetch footer data' }, { status: 500 })
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/admin/footer
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body = await request.json()

        const existing = await prisma.siteSettings.findFirst()

        const payload = {
            siteName: body.siteName ?? '',
            tagline: body.tagline ?? '',
            email: body.email ?? '',
            phone: body.phone ?? '',
            address: body.address ?? '',
            openHours: body.openHours ?? '',
            instagramUrl: body.instagramUrl ?? '',
            facebookUrl: body.facebookUrl ?? '',
            youtubeUrl: body.youtubeUrl ?? '',
            tiktokUrl: body.tiktokUrl ?? '',
        }

        const row = existing
            ? await prisma.siteSettings.update({ where: { id: existing.id }, data: payload })
            : await prisma.siteSettings.create({ data: payload })

        return NextResponse.json({ success: true, message: 'Footer updated successfully', data: row })
    } catch (error) {
        console.error('[FOOTER POST]', error)
        return NextResponse.json({ success: false, message: 'Failed to save footer data' }, { status: 500 })
    }
}