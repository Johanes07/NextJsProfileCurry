import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const apps = await prisma.jobApplication.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, positionTitle: true, namaLengkap: true,
                email: true, noTelp: true, jenisKelamin: true, usia: true,
                pendidikan: true, agama: true, statusNikah: true, alamatDomisili: true,
                cvFileName: true, fotoFileName: true, isRead: true, createdAt: true,
                nik: true, tempatLahir: true, tanggalLahir: true, anakKe: true,
                dariSaudara: true, golDarah: true, kondisiMata: true,
                tinggiBadan: true, beratBadan: true, lulusTahun: true,
                bersediaShift: true, puyaTindikTato: true, perokok: true,
                riwayatPenyakit: true, alamatKTP: true,
                pengalamanKerja: true, seminarKursus: true, organisasi: true,
            }
        })
        return NextResponse.json(apps)
    } catch {
        return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 })
    }
}