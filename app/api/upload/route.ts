import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        const folder = (formData.get('folder') as string) || 'uploads'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const ext = path.extname(file.name)
        const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '-')
        const filename = `${base}-${Date.now()}${ext}`

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
        await mkdir(uploadDir, { recursive: true })

        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)

        const url = `/uploads/${folder}/${filename}`
        return NextResponse.json({ url })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }
}