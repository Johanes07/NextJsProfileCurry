import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── Types ──────────────────────────────────────────────────────────────────
type Feature = {
    id: string
    iconName: string
    title: string
    desc: string
}

type CTAData = {
    badge: string
    headline1: string
    headline2: string
    description: string
    address: string
    hours: string
    phone: string
    buttonLabel: string
    features: Feature[]
}

const DEFAULT_FEATURES: Feature[] = [
    { id: '1', iconName: 'FlameKindling', title: 'Slow-Fired 100 Hours', desc: 'Every batch simmered to absolute perfection' },
    { id: '2', iconName: 'Leaf', title: 'All-Natural Spices', desc: '27 hand-sourced ingredients, zero shortcuts' },
    { id: '3', iconName: 'Star', title: "Jakarta's Finest", desc: 'Best Curry Award — 3 years running' },
    { id: '4', iconName: 'Bike', title: 'At Your Door in 30', desc: 'Piping hot, guaranteed fresh on arrival' },
]

// ─────────────────────────────────────────────────────────────────────────────
// GET  /api/admin/cta
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
    try {
        let row = await prisma.ctaSection.findFirst()

        // Seed row jika belum ada
        if (!row) {
            row = await prisma.ctaSection.create({
                data: {
                    badge: 'COME FIND US',
                    headline1: 'ONE BOWL.',
                    headline2: 'FOREVER.',
                    description: 'A curry so carefully crafted, one visit is all it takes to make you a regular. Come see what the obsession is about.',
                    address: 'Jl. Kuliner No. 1, Jakarta Selatan',
                    hours: 'Open Daily: 11:00 AM – 10:00 PM',
                    phone: '+62 21 1234 5678',
                    buttonLabel: 'Get Directions',
                    features: DEFAULT_FEATURES,
                },
            })
        }

        const data: CTAData = {
            badge: row.badge,
            headline1: row.headline1,
            headline2: row.headline2,
            description: row.description,
            address: row.address,
            hours: row.hours,
            phone: row.phone,
            buttonLabel: row.buttonLabel,
            features: row.features as Feature[],
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('[CTA GET]', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch CTA data' },
            { status: 500 }
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST  /api/admin/cta
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const body: CTAData = await request.json()

        // ── Validation ────────────────────────────────────────────────────
        const required: (keyof CTAData)[] = [
            'badge', 'headline1', 'headline2',
            'description', 'address', 'hours',
            'phone', 'buttonLabel', 'features',
        ]

        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, message: `Field "${field}" is required` },
                    { status: 400 }
                )
            }
        }

        if (!Array.isArray(body.features) || body.features.length !== 4) {
            return NextResponse.json(
                { success: false, message: 'features must be an array of 4 items' },
                { status: 400 }
            )
        }

        // ── Upsert (singleton row) ────────────────────────────────────────
        const existing = await prisma.ctaSection.findFirst()

        const payload = {
            badge: body.badge,
            headline1: body.headline1,
            headline2: body.headline2,
            description: body.description,
            address: body.address,
            hours: body.hours,
            phone: body.phone,
            buttonLabel: body.buttonLabel,
            features: body.features,
        }

        const row = existing
            ? await prisma.ctaSection.update({ where: { id: existing.id }, data: payload })
            : await prisma.ctaSection.create({ data: payload })

        return NextResponse.json({
            success: true,
            message: 'CTA updated successfully',
            data: { ...row, features: row.features as Feature[] },
        })
    } catch (error) {
        console.error('[CTA POST]', error)
        return NextResponse.json(
            { success: false, message: 'Failed to save CTA data' },
            { status: 500 }
        )
    }
}