import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ── GET ───────────────────────────────────────────────────────────────────
export async function GET() {
    try {
        let record = await prisma.ourValuesContent.findFirst()

        // Kalau belum ada, auto-create dengan default values
        if (!record) {
            record = await prisma.ourValuesContent.create({
                data: {
                    badge: 'What We Stand For',
                    headingLine1: 'OUR',
                    headingLine2: 'VALUES',
                    values: [
                        { id: '1', icon: 'Timer', title: 'No Shortcuts', desc: 'We cook every batch for exactly 100 hours. Not 99, not 101. The process is sacred and non-negotiable.' },
                        { id: '2', icon: 'Leaf', title: 'Finest Ingredients', desc: 'We source 27 hand-selected spices from trusted farms. Quality ingredients are the foundation of great curry.' },
                        { id: '3', icon: 'Heart', title: 'Made with Love', desc: 'Every bowl is prepared with genuine care. We treat each serving as if cooking for our own family.' },
                        { id: '4', icon: 'FlaskConical', title: 'Obsessive Quality', desc: 'Every batch is tasted and adjusted by our head chef. Consistency is our promise to every customer.' },
                    ],
                },
            })
        }

        return NextResponse.json({ success: true, data: record })
    } catch (error) {
        console.error('[our-values GET]', error)
        return NextResponse.json({ success: false, message: 'Gagal memuat data' }, { status: 500 })
    }
}

// ── POST ──────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { badge, headingLine1, headingLine2, values } = body

        // Validasi minimal
        if (!badge || !headingLine1 || !headingLine2) {
            return NextResponse.json({ success: false, message: 'Badge dan heading tidak boleh kosong' }, { status: 400 })
        }

        if (!Array.isArray(values)) {
            return NextResponse.json({ success: false, message: 'Values harus berupa array' }, { status: 400 })
        }

        // Upsert — update kalau sudah ada, create kalau belum
        const existing = await prisma.ourValuesContent.findFirst()

        let record
        if (existing) {
            record = await prisma.ourValuesContent.update({
                where: { id: existing.id },
                data: { badge, headingLine1, headingLine2, values },
            })
        } else {
            record = await prisma.ourValuesContent.create({
                data: { badge, headingLine1, headingLine2, values },
            })
        }

        return NextResponse.json({ success: true, data: record })
    } catch (error) {
        console.error('[our-values POST]', error)
        return NextResponse.json({ success: false, message: 'Gagal menyimpan data' }, { status: 500 })
    }
}