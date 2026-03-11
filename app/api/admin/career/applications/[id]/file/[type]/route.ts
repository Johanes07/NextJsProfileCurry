import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string; type: string }> }
) {
    try {
        const { id, type } = await params

        if (type !== 'cv' && type !== 'foto') {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        const app = await prisma.jobApplication.findUnique({
            where: { id },
            select: {
                cvData: true,
                cvFileName: true,
                fotoData: true,
                fotoFileName: true,
            }
        })

        if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const fileData = type === 'cv' ? app.cvData : app.fotoData
        const fileName = type === 'cv' ? app.cvFileName : app.fotoFileName

        if (!fileData || !fileName) {
            return NextResponse.json({ error: 'File tidak tersedia' }, { status: 404 })
        }

        const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
        const contentTypeMap: Record<string, string> = {
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
        }
        const contentType = contentTypeMap[ext] ?? 'application/octet-stream'

        return new NextResponse(new Uint8Array(fileData as Buffer), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileName}"`,
            },
        })

    } catch (err) {
        console.error('[file serve] error:', err)
        return NextResponse.json({ error: 'Gagal mengambil file' }, { status: 500 })
    }
}