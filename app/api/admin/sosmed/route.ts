import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const posts = await prisma.sosmedPost.findMany({
            orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
        })
        return NextResponse.json(posts)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const post = await prisma.sosmedPost.create({ data: body })
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
    }
}