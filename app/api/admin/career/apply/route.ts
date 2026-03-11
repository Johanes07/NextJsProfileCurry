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

export function buildEmailHtml(data: Record<string, any>): string {
    const row = (label: string, value: string) =>
        `<tr>
            <td style="padding:7px 16px 7px 0;color:#888888;font-size:13px;font-family:Arial,sans-serif;white-space:nowrap;vertical-align:top;width:170px;">${label}</td>
            <td style="padding:7px 0;color:#111111;font-size:13px;font-family:Arial,sans-serif;font-weight:700;">${value || '—'}</td>
        </tr>`

    const section = (title: string, content: string) =>
        `<tr>
            <td colspan="2" style="padding:22px 0 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding-bottom:8px;font-size:10px;font-weight:900;letter-spacing:3px;color:#eab308;font-family:Arial,sans-serif;text-transform:uppercase;border-bottom:2px solid #eab308;">
                            ${title}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        ${content}`

    const pengalaman = Array.isArray(data.pengalamanKerja) && data.pengalamanKerja.length
        ? data.pengalamanKerja.map((p: any, i: number) =>
            `<tr>
                <td colspan="2" style="padding:8px 0 4px 12px;font-size:12px;font-family:Arial,sans-serif;color:#333333;border-left:3px solid #eab308;">
                    <span style="font-weight:700;">${i + 1}. ${p.perusahaan || '—'}</span> &mdash; ${p.posisi || '—'}<br/>
                    <span style="color:#888888;font-size:11px;">Periode: ${p.dari || '—'} s/d ${p.sampai || '—'} &nbsp;&middot;&nbsp; Alasan keluar: ${p.alasanKeluar || '—'}</span>
                </td>
            </tr>
            <tr><td colspan="2" style="padding:4px 0;"></td></tr>`
        ).join('')
        : row('Pengalaman Kerja', 'Belum ada pengalaman')

    const seminar = Array.isArray(data.seminarKursus) && data.seminarKursus.length
        ? data.seminarKursus.map((s: any, i: number) =>
            `<tr>
                <td colspan="2" style="padding:8px 0 4px 12px;font-size:12px;font-family:Arial,sans-serif;color:#333333;border-left:3px solid #eab308;">
                    <span style="font-weight:700;">${i + 1}. ${s.nama || '—'}</span> &mdash; ${s.penyelenggara || '—'}
                    <span style="color:#888888;font-size:11px;">(${s.tahun || '—'})</span>
                </td>
            </tr>
            <tr><td colspan="2" style="padding:4px 0;"></td></tr>`
        ).join('')
        : row('Seminar / Kursus', 'Tidak ada')

    const org = Array.isArray(data.organisasi) && data.organisasi.length
        ? data.organisasi.map((o: any, i: number) =>
            `<tr>
                <td colspan="2" style="padding:8px 0 4px 12px;font-size:12px;font-family:Arial,sans-serif;color:#333333;border-left:3px solid #eab308;">
                    <span style="font-weight:700;">${i + 1}. ${o.nama || '—'}</span> &mdash; ${o.jabatan || '—'}
                    <span style="color:#888888;font-size:11px;">(${o.tahun || '—'})</span>
                </td>
            </tr>
            <tr><td colspan="2" style="padding:4px 0;"></td></tr>`
        ).join('')
        : row('Organisasi', 'Tidak ada')

    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Lamaran Kerja Baru</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f0eb;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f0eb;">
    <tr>
        <td align="center" style="padding:32px 16px;">

            <!-- Email card -->
            <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background-color:#ffffff;">

                <!-- ══ HEADER ══ -->
                <tr>
                    <td style="background-color:#111111;padding:24px 32px;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <!-- Logo box -->
                                <td style="background-color:#eab308;width:52px;height:52px;text-align:center;vertical-align:middle;">
                                    <table cellpadding="0" cellspacing="0" border="0" width="52" height="52">
                                        <tr>
                                            <td align="center" valign="middle">
                                                <span style="font-size:24px;font-weight:900;color:#000000;font-family:Arial,sans-serif;line-height:1;">C</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                                <!-- Brand name -->
                                <td style="padding-left:16px;vertical-align:middle;">
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <!-- Row 1: [100 box] [HOURS] -->
                                        <tr>
                                            <td style="padding-bottom:4px;">
                                                <table cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td style="background-color:#eab308;padding:3px 7px;">
                                                            <span style="font-size:14px;font-weight:900;color:#000000;font-family:Arial,sans-serif;letter-spacing:1px;">100</span>
                                                        </td>
                                                        <td style="padding-left:7px;">
                                                            <span style="font-size:14px;font-weight:900;color:#ffffff;font-family:Arial,sans-serif;letter-spacing:3px;">HOURS</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- Row 2: CURRY -->
                                        <tr>
                                            <td>
                                                <span style="font-size:22px;font-weight:900;color:#eab308;font-family:Arial,sans-serif;letter-spacing:5px;text-transform:uppercase;">CURRY</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- ══ SUBTITLE BAR ══ -->
                <tr>
                    <td style="background-color:#1a1a1a;padding:10px 32px;">
                        <span style="font-size:10px;font-weight:700;color:#777777;font-family:Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;">&#9993; &nbsp; LAMARAN KERJA BARU MASUK</span>
                    </td>
                </tr>

                <!-- ══ POSITION BANNER ══ -->
                <tr>
                    <td style="background-color:#eab308;padding:18px 32px;">
                        <p style="margin:0;font-size:10px;font-weight:900;letter-spacing:2px;color:#7a5f00;font-family:Arial,sans-serif;text-transform:uppercase;">POSISI YANG DILAMAR</p>
                        <p style="margin:6px 0 0;font-size:22px;font-weight:900;color:#000000;font-family:Arial,sans-serif;">${data.positionTitle || '—'}</p>
                    </td>
                </tr>

                <!-- ══ BODY ══ -->
                <tr>
                    <td style="padding:8px 32px 32px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">

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

                            ${section('Fisik &amp; Kondisi',
        row('Tinggi / Berat', `${data.tinggiBadan} cm / ${data.beratBadan} kg`) +
        row('Kondisi Mata', data.kondisiMata) +
        row('Tindik / Tato', data.puyaTindikTato) +
        row('Perokok', data.perokok) +
        row('Riwayat Penyakit', data.riwayatPenyakit || 'Tidak ada')
    )}

                            ${section('Pendidikan &amp; Preferensi',
        row('Pendidikan', `${data.pendidikan} (Lulus ${data.lulusTahun})`) +
        row('Bersedia Kerja Shift', data.bersediaShift)
    )}

                            ${section('Pengalaman Kerja', pengalaman)}
                            ${section('Seminar / Kursus', seminar)}
                            ${section('Organisasi / Kegiatan', org)}

                        </table>
                    </td>
                </tr>

                <!-- ══ ACCENT STRIPE ══ -->
                <tr>
                    <td style="background-color:#eab308;height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>

                <!-- ══ FOOTER ══ -->
                <tr>
                    <td style="background-color:#111111;padding:18px 32px;">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center">
                                    <p style="margin:0;font-size:12px;color:#555555;font-family:Arial,sans-serif;">
                                        Dikirim pada &nbsp;
                                        <span style="color:#eab308;font-weight:700;">
                                            ${new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })} WIB
                                        </span>
                                    </p>
                                    <p style="margin:8px 0 0;font-size:10px;color:#444444;font-family:Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;">
                                        100Hours Curry &mdash; Career Portal
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

            </table>
            <!-- /Email card -->

        </td>
    </tr>
</table>
<!-- /Outer wrapper -->

</body>
</html>`
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