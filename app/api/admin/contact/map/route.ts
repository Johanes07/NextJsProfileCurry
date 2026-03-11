import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DEFAULT = {
    centerLat: -6.8,
    centerLng: 107.5,
    zoom: 8,
    markers: [
        { id: '1', title: '100Hours @ CGK T1', address: 'Bandara Soekarno-Hatta Terminal 1', lat: -6.1256, lng: 106.6558 },
        { id: '2', title: '100Hours @ AEON Mall TJB', address: 'AEON Mall Jakarta Garden City', lat: -6.3003, lng: 106.6531 },
    ],
}

export async function GET() {
    try {
        let record = await prisma.contactMapContent.findFirst()
        if (!record) {
            record = await prisma.contactMapContent.create({
                data: {
                    centerLat: DEFAULT.centerLat,
                    centerLng: DEFAULT.centerLng,
                    zoom: DEFAULT.zoom,
                    markers: DEFAULT.markers,
                }
            })
        }
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json()
        let record
        if (id) {
            record = await prisma.contactMapContent.update({ where: { id }, data })
        } else {
            const existing = await prisma.contactMapContent.findFirst()
            record = existing
                ? await prisma.contactMapContent.update({ where: { id: existing.id }, data })
                : await prisma.contactMapContent.create({ data })
        }
        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: 'Gagal menyimpan data' }, { status: 500 })
    }
}