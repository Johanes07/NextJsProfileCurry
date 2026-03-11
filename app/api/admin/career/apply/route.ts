import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'

// ── Config ────────────────────────────────────────────────────
const MAX_FILE_SIZE = 200 * 1024 // 200 KB

// ── Nodemailer ────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host: 'mail.rotio.id',
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

// ── Email HTML ────────────────────────────────────────────────
function buildEmailHtml(data: Record<string, any>): string {
    const row = (label: string, value: string) =>
        `<tr>
            <td style="padding:6px 12px;color:#888;font-size:13px;white-space:nowrap;vertical-align:top;width:160px;">${label}</td>
            <td style="padding:6px 12px;color:#111;font-size:13px;font-weight:600;">${value || '—'}</td>
        </tr>`

    const section = (title: string, content: string) =>
        `<tr><td colspan="2" style="padding:20px 12px 6px;font-size:10px;font-weight:900;letter-spacing:3px;color:#eab308;text-transform:uppercase;border-top:1px solid #f0f0f0;">${title}</td></tr>
        ${content}`

    const pengalaman = Array.isArray(data.pengalamanKerja) && data.pengalamanKerja.length
        ? data.pengalamanKerja.map((p: any, i: number) =>
            `<tr><td colspan="2" style="padding:6px 12px 6px 24px;font-size:12px;color:#333;">
                <b>${i + 1}. ${p.perusahaan || '—'}</b> &mdash; ${p.posisi || '—'}<br/>
                <span style="color:#888;">Periode: ${p.dari || '—'} s/d ${p.sampai || '—'} &nbsp;|&nbsp; Alasan keluar: ${p.alasanKeluar || '—'}</span>
             </td></tr>`).join('')
        : row('Pengalaman Kerja', 'Belum ada pengalaman')

    const seminar = Array.isArray(data.seminarKursus) && data.seminarKursus.length
        ? data.seminarKursus.map((s: any, i: number) =>
            `<tr><td colspan="2" style="padding:6px 12px 6px 24px;font-size:12px;color:#333;">
                <b>${i + 1}. ${s.nama || '—'}</b> &mdash; ${s.penyelenggara || '—'} (${s.tahun || '—'})
             </td></tr>`).join('')
        : row('Seminar/Kursus', 'Tidak ada')

    const org = Array.isArray(data.organisasi) && data.organisasi.length
        ? data.organisasi.map((o: any, i: number) =>
            `<tr><td colspan="2" style="padding:6px 12px 6px 24px;font-size:12px;color:#333;">
                <b>${i + 1}. ${o.nama || '—'}</b> &mdash; ${o.jabatan || '—'} (${o.tahun || '—'})
             </td></tr>`).join('')
        : row('Organisasi', 'Tidak ada')

    return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
    <body style="margin:0;padding:0;background:#f5f5f0;font-family:Arial,sans-serif;">
    <div style="max-width:640px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#111;padding:24px 32px;display:flex;align-items:center;gap:16px;">
        <div style="background:#eab308;width:44px;height:44px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;">
          <span style="font-size:20px;font-weight:900;color:#000;line-height:1;">C</span>
        </div>
        <div style="display:inline-block;margin-left:12px;vertical-align:top;">
          <p style="margin:0;color:#eab308;font-size:10px;font-weight:900;letter-spacing:3px;">100HOURS CURRY</p>
          <p style="margin:4px 0 0;color:#fff;font-size:18px;font-weight:900;">Lamaran Kerja Baru</p>
        </div>
      </div>

      <!-- Position Banner -->
      <div style="background:#eab308;padding:14px 32px;">
        <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:2px;color:#000;">POSISI YANG DILAMAR</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#000;">${data.positionTitle}</p>
      </div>

      <!-- Table -->
      <div style="padding:8px 20px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${section('Data Pribadi',
        row('Nama Lengkap', data.namaLengkap) +
        row('NIK', data.nik) +
        row('Email', data.email) +
        row('No. Telp', data.noTelp) +
        row('Tempat / Tgl Lahir', `${data.tempatLahir}, ${data.tanggalLahir}`) +
        row('Usia', `${data.usia} tahun`) +
        row('Anak ke / dari', `${data.anakKe} dari ${data.dariSaudara} saudara`) +
        row('Jenis Kelamin', data.jenisKelamin) +
        row('Agama', data.agama) +
        row('Gol. Darah', data.golDarah) +
        row('Status Pernikahan', data.statusNikah)
    )}
          ${section('Alamat',
        row('Alamat KTP', data.alamatKTP) +
        row('Alamat Domisili', data.alamatDomisili)
    )}
          ${section('Fisik & Kondisi',
        row('Tinggi / Berat', `${data.tinggiBadan} cm / ${data.beratBadan} kg`) +
        row('Kondisi Mata', data.kondisiMata) +
        row('Tindik / Tato', data.puyaTindikTato) +
        row('Perokok', data.perokok) +
        row('Riwayat Penyakit', data.riwayatPenyakit || 'Tidak ada')
    )}
          ${section('Pendidikan & Preferensi',
        row('Pendidikan', `${data.pendidikan} (Lulus ${data.lulusTahun})`) +
        row('Bersedia Kerja Shift', data.bersediaShift)
    )}
          ${section('Pengalaman Kerja', pengalaman)}
          ${section('Seminar / Kursus', seminar)}
          ${section('Organisasi / Kegiatan', org)}
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f5f5f0;padding:16px 32px;text-align:center;">
        <p style="margin:0;font-size:11px;color:#aaa;">
          Lamaran dikirim pada ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
          &nbsp;&middot;&nbsp; 100Hours Curry Career Portal
        </p>
      </div>
    </div>
    </body></html>`
}

// ── POST /api/career/apply ────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const get = (k: string) => (formData.get(k) as string) ?? ''
        const parseJson = (k: string) => { try { return JSON.parse(get(k)) } catch { return [] } }

        // ── Validasi field wajib ──────────────────────────────
        const namaLengkap = get('namaLengkap')
        const email = get('email')
        const nik = get('nik')
        const noTelp = get('noTelp')

        if (!namaLengkap || !email || !nik || !noTelp) {
            return NextResponse.json({ error: 'Field wajib tidak lengkap' }, { status: 400 })
        }

        // ── Parse & validasi file ─────────────────────────────
        const cvFile = formData.get('cv') as File | null
        const fotoFile = formData.get('foto') as File | null

        if (cvFile && cvFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: `CV terlalu besar (${(cvFile.size / 1024).toFixed(0)} KB). Maksimal 200 KB.` }, { status: 400 })
        }
        if (fotoFile && fotoFile.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: `Foto terlalu besar (${(fotoFile.size / 1024).toFixed(0)} KB). Maksimal 200 KB.` }, { status: 400 })
        }

        // ── Build app data ────────────────────────────────────
        const appData = {
            positionTitle: get('positionTitle'),
            namaLengkap,
            alamatKTP: get('alamatKTP'),
            alamatDomisili: get('alamatDomisili'),
            email,
            tempatLahir: get('tempatLahir'),
            tanggalLahir: get('tanggalLahir'),
            usia: get('usia'),
            anakKe: get('anakKe'),
            dariSaudara: get('dariSaudara'),
            nik,
            agama: get('agama'),
            golDarah: get('golDarah'),
            jenisKelamin: get('jenisKelamin'),
            noTelp,
            kondisiMata: get('kondisiMata'),
            tinggiBadan: get('tinggiBadan'),
            beratBadan: get('beratBadan'),
            pendidikan: get('pendidikan'),
            lulusTahun: get('lulusTahun'),
            statusNikah: get('statusNikah'),
            bersediaShift: get('bersediaShift'),
            puyaTindikTato: get('puyaTindikTato'),
            perokok: get('perokok'),
            riwayatPenyakit: get('riwayatPenyakit'),
            pengalamanKerja: parseJson('pengalamanKerja'),
            seminarKursus: parseJson('seminarKursus'),
            organisasi: parseJson('organisasi'),
        }

        // ── Convert files to Buffer ───────────────────────────
        let cvBuffer: Buffer | null = null
        let fotoBuffer: Buffer | null = null
        let cvFileName: string | null = null
        let fotoFileName: string | null = null

        if (cvFile && cvFile.size > 0) {
            cvBuffer = Buffer.from(await cvFile.arrayBuffer())
            cvFileName = cvFile.name
        }
        if (fotoFile && fotoFile.size > 0) {
            fotoBuffer = Buffer.from(await fotoFile.arrayBuffer())
            fotoFileName = fotoFile.name
        }

        // ── Save to DB ────────────────────────────────────────
        const positionId = get('positionId') || null

        const saved = await prisma.jobApplication.create({
            data: {
                ...appData,
                positionId,
                cvFileName,
                fotoFileName,
                cvData: cvBuffer ?? undefined,
                fotoData: fotoBuffer ?? undefined,
            }
        })

        // ── Cari email HRD dari JobPosition ───────────────────
        // Priority: hrdEmail di job position → HRD_EMAIL env → fallback
        let hrdEmail = process.env.HRD_EMAIL ?? 'hrd@100hourscurry.com'

        if (positionId) {
            const position = await prisma.jobPosition.findUnique({
                where: { id: positionId },
                select: { hrdEmail: true }
            })
            if (position?.hrdEmail) {
                hrdEmail = position.hrdEmail
            }
        }

        // ── Build email attachments ───────────────────────────
        const attachments: { filename: string; content: Buffer }[] = []
        if (cvBuffer && cvFileName) attachments.push({ filename: cvFileName, content: cvBuffer })
        if (fotoBuffer && fotoFileName) attachments.push({ filename: fotoFileName, content: fotoBuffer })

        // ── Send email ────────────────────────────────────────
        await transporter.sendMail({
            from: `"Career Portal 100Hours" <${process.env.SMTP_USER}>`,
            to: hrdEmail,
            subject: `[Lamaran] ${appData.positionTitle} — ${appData.namaLengkap}`,
            html: buildEmailHtml(appData),
            attachments,
        })

        return NextResponse.json({ success: true, id: saved.id })

    } catch (err) {
        console.error('[career/apply] error:', err)
        return NextResponse.json({ error: 'Gagal mengirim lamaran, coba lagi' }, { status: 500 })
    }
}