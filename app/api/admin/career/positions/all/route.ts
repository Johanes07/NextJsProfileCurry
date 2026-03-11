import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all (admin - termasuk nonaktif)
export async function GET() {
    try {
        const positions = await prisma.jobPosition.findMany({
            orderBy: { createdAt: 'asc' },
        })
        return NextResponse.json(positions)
    } catch {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}

// POST - tambah posisi baru
export async function POST(req: Request) {
    try {
        const { id, ...data } = await req.json()
        const position = await prisma.jobPosition.create({
            data: {
                title: data.title,
                dept: data.dept,
                type: data.type,
                location: data.location,
                desc: data.desc,
                requirements: data.requirements?.filter((r: string) => r.trim()) ?? [],
                isActive: data.isActive ?? true,
            }
        })
        return NextResponse.json(position)
    } catch {
        return NextResponse.json({ error: 'Gagal menyimpan posisi' }, { status: 500 })
    }
}