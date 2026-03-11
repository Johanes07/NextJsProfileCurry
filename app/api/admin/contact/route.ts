import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const WINDOW_MS = 60_000

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
        const now = Date.now()
        const entry = rateLimitMap.get(ip)

        if (entry) {
            if (now < entry.resetAt) {
                if (entry.count >= RATE_LIMIT) {
                    return NextResponse.json(
                        { error: 'Too many requests. Please wait before sending again.' },
                        { status: 429 }
                    )
                }
                entry.count++
            } else {
                rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
            }
        } else {
            rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
        }

        const body = await req.json()
        const { name, phone, email, subject, country, city, message } = body

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        if (name.length > 100 || message.length > 2000 || subject.length > 200) {
            return NextResponse.json({ error: 'Input too long' }, { status: 400 })
        }

        const record = await prisma.contactMessage.create({
            data: {
                name: name.trim(),
                phone: phone?.trim() ?? '',
                email: email.trim().toLowerCase(),
                subject: subject.trim(),
                country: country?.trim() ?? '',
                city: city?.trim() ?? '',
                message: message.trim(),
            },
        })

        return NextResponse.json({ success: true, id: record.id })
    } catch (error) {
        console.error('[POST /api/admin/contact]', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}