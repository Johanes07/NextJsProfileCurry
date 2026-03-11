import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - update posisi
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const { id: _id, createdAt, updatedAt, ...data } = await req.json()
        const position = await prisma.jobPosition.update({
            where: { id },
            data: {
                title: data.title,
                dept: data.dept,
                type: data.type,
                location: data.location,
                desc: data.desc,
                requirements: data.requirements?.filter((r: string) => r.trim()) ?? [],
                isActive: data.isActive,
            }
        })
        return NextResponse.json(position)
    } catch {
        return NextResponse.json({ error: 'Gagal mengupdate posisi' }, { status: 500 })
    }
}

// DELETE - hapus posisi
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        await prisma.jobPosition.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Gagal menghapus posisi' }, { status: 500 })
    }
}