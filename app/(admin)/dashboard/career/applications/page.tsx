'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Mail, MapPin, Phone, Eye, Trash2, CheckCircle, X, Download, Loader2, RefreshCw } from 'lucide-react'

interface Application {
    id: string
    positionTitle: string
    namaLengkap: string
    email: string
    noTelp: string
    jenisKelamin: string
    usia: string
    pendidikan: string
    agama: string
    statusNikah: string
    alamatDomisili: string
    cvFileName: string | null
    fotoFileName: string | null
    isRead: boolean
    createdAt: string
    // detail fields
    nik?: string
    tempatLahir?: string
    tanggalLahir?: string
    anakKe?: string
    dariSaudara?: string
    golDarah?: string
    kondisiMata?: string
    tinggiBadan?: string
    beratBadan?: string
    lulusTahun?: string
    bersediaShift?: string
    puyaTindikTato?: string
    perokok?: string
    riwayatPenyakit?: string
    alamatKTP?: string
    pengalamanKerja?: any[]
    seminarKursus?: any[]
    organisasi?: any[]
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${color}`}>{children}</span>
}

function DetailModal({ app, onClose, onDelete }: {
    app: Application; onClose: () => void; onDelete: (id: string) => void
}) {
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', fn)
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
    }, [onClose])

    async function handleDelete() {
        if (!confirm(`Hapus lamaran dari ${app.namaLengkap}?`)) return
        setDeleting(true)
        await onDelete(app.id)
        onClose()
    }

    const row = (label: string, value?: string) => value ? (
        <div className="flex gap-3">
            <span className="text-zinc-500 text-xs w-36 shrink-0 pt-0.5">{label}</span>
            <span className="text-zinc-200 text-sm font-medium flex-1">{value}</span>
        </div>
    ) : null

    const pengalaman = Array.isArray(app.pengalamanKerja) ? app.pengalamanKerja : []
    const seminar = Array.isArray(app.seminarKursus) ? app.seminarKursus : []
    const org = Array.isArray(app.organisasi) ? app.organisasi : []

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/60 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-zinc-800/60 flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                                {app.positionTitle}
                            </span>
                            <span className="text-xs text-zinc-500">
                                {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-white">{app.namaLengkap}</h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs text-zinc-400">{app.email}</span>
                            <span className="text-zinc-700">·</span>
                            <span className="text-xs text-zinc-400">{app.noTelp}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center transition-all shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Data Pribadi */}
                    <div className="bg-zinc-900/60 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Data Pribadi</p>
                        {row('NIK', app.nik)}
                        {row('Tempat / Tgl Lahir', app.tempatLahir && app.tanggalLahir ? `${app.tempatLahir}, ${app.tanggalLahir}` : undefined)}
                        {row('Usia', app.usia ? app.usia + ' tahun' : undefined)}
                        {row('Anak ke / dari', app.anakKe ? `${app.anakKe} dari ${app.dariSaudara} saudara` : undefined)}
                        {row('Jenis Kelamin', app.jenisKelamin)}
                        {row('Agama', app.agama)}
                        {row('Gol. Darah', app.golDarah)}
                        {row('Status Nikah', app.statusNikah)}
                        {row('Pendidikan', app.pendidikan && app.lulusTahun ? `${app.pendidikan} / Lulus ${app.lulusTahun}` : app.pendidikan)}
                    </div>

                    {/* Alamat */}
                    <div className="bg-zinc-900/60 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Alamat</p>
                        {row('Alamat KTP', app.alamatKTP)}
                        {row('Domisili', app.alamatDomisili)}
                    </div>

                    {/* Fisik */}
                    <div className="bg-zinc-900/60 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Fisik & Kondisi</p>
                        {row('Tinggi / Berat', app.tinggiBadan ? `${app.tinggiBadan} cm / ${app.beratBadan} kg` : undefined)}
                        {row('Kondisi Mata', app.kondisiMata)}
                        {row('Tindik / Tato', app.puyaTindikTato)}
                        {row('Perokok', app.perokok)}
                        {row('Riwayat Penyakit', app.riwayatPenyakit || 'Tidak ada')}
                        {row('Bersedia Shift', app.bersediaShift)}
                    </div>

                    {/* Pengalaman */}
                    {pengalaman.length > 0 && (
                        <div className="bg-zinc-900/60 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Pengalaman Kerja</p>
                            <div className="space-y-4">
                                {pengalaman.map((p: any, i: number) => (
                                    <div key={i} className="border-l-2 border-yellow-400/30 pl-4">
                                        <p className="text-sm font-bold text-white">{p.perusahaan}</p>
                                        <p className="text-xs text-zinc-400">{p.posisi} · {p.dari} s/d {p.sampai}</p>
                                        {p.alasanKeluar && <p className="text-xs text-zinc-600 mt-1">Alasan keluar: {p.alasanKeluar}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seminar */}
                    {seminar.length > 0 && (
                        <div className="bg-zinc-900/60 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Seminar / Kursus</p>
                            <div className="space-y-2">
                                {seminar.map((s: any, i: number) => (
                                    <p key={i} className="text-sm text-zinc-300">
                                        <span className="font-bold">{s.nama}</span> — {s.penyelenggara} ({s.tahun})
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Org */}
                    {org.length > 0 && (
                        <div className="bg-zinc-900/60 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Organisasi / Kegiatan</p>
                            <div className="space-y-2">
                                {org.map((o: any, i: number) => (
                                    <p key={i} className="text-sm text-zinc-300">
                                        <span className="font-bold">{o.nama}</span> — {o.jabatan} ({o.tahun})
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files */}
                    {/* Files */}
                    {(app.cvFileName || app.fotoFileName) && (
                        <div className="bg-zinc-900/60 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Dokumen Terlampir</p>
                            <div className="space-y-3">

                                {/* CV */}
                                {app.cvFileName && (
                                    <div className="bg-zinc-800 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4 text-yellow-400 shrink-0" />
                                            <span className="text-sm text-zinc-300 flex-1 truncate">{app.cvFileName}</span>
                                            <div className="flex gap-2 shrink-0">
                                                <a
                                                    href={`/api/admin/career/applications/${app.id}/file/cv`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-300 transition-all"
                                                >
                                                    <Eye className="w-3 h-3" /> Buka
                                                </a>
                                                <a
                                                    href={`/api/admin/career/applications/${app.id}/file/cv`}
                                                    download={app.cvFileName}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-200 text-xs font-black rounded-lg hover:bg-zinc-600 transition-all"
                                                >
                                                    <Download className="w-3 h-3" /> Unduh
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Foto */}
                                {app.fotoFileName && (
                                    <div className="bg-zinc-800 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Eye className="w-4 h-4 text-yellow-400 shrink-0" />
                                            <span className="text-sm text-zinc-300 flex-1 truncate">{app.fotoFileName}</span>
                                            <div className="flex gap-2 shrink-0">
                                                <a
                                                    href={`/api/admin/career/applications/${app.id}/file/foto`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:bg-yellow-300 transition-all"
                                                >
                                                    <Eye className="w-3 h-3" /> Buka
                                                </a>
                                                <a
                                                    href={`/api/admin/career/applications/${app.id}/file/foto`}
                                                    download={app.fotoFileName}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-700 text-zinc-200 text-xs font-black rounded-lg hover:bg-zinc-600 transition-all"
                                                >
                                                    <Download className="w-3 h-3" /> Unduh
                                                </a>
                                            </div>
                                        </div>
                                        {/* Preview langsung kalau gambar */}
                                        {/\.(jpg|jpeg|png|webp)$/i.test(app.fotoFileName) && (
                                            <div className="mt-3 rounded-xl overflow-hidden border border-zinc-700">
                                                <img
                                                    src={`/api/admin/career/applications/${app.id}/file/foto`}
                                                    alt={`Foto ${app.namaLengkap}`}
                                                    className="w-full max-h-72 object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-zinc-800/60 flex gap-3 shrink-0">
                    <a href={`mailto:${app.email}?subject=Re: Lamaran ${app.positionTitle}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:bg-yellow-300 transition-all">
                        <Mail className="w-4 h-4" /> Balas via Email
                    </a>
                    <button onClick={handleDelete} disabled={deleting}
                        className="px-5 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-bold hover:border-red-500/40 hover:text-red-400 hover:bg-red-400/5 disabled:opacity-40 transition-all flex items-center gap-2">
                        {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function CareerApplicationsCMS() {
    const [apps, setApps] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Application | null>(null)
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [search, setSearch] = useState('')

    async function fetchApps() {
        try {
            const res = await fetch('/api/admin/career/applications')
            setApps(await res.json())
        } catch { }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchApps() }, [])

    async function markRead(id: string) {
        await fetch(`/api/admin/career/applications/${id}/read`, { method: 'PATCH' })
        setApps(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a))
    }

    async function handleDelete(id: string) {
        await fetch(`/api/admin/career/applications/${id}`, { method: 'DELETE' })
        setApps(prev => prev.filter(a => a.id !== id))
    }

    async function handleOpen(app: Application) {
        setSelected(app)
        if (!app.isRead) await markRead(app.id)
    }

    const filtered = apps
        .filter(a => filter === 'all' ? true : filter === 'unread' ? !a.isRead : a.isRead)
        .filter(a => !search || a.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase()) ||
            a.positionTitle.toLowerCase().includes(search.toLowerCase()))

    const unreadCount = apps.filter(a => !a.isRead).length

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-yellow-400" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-black text-xs font-black rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Inbox Lamaran</h1>
                            <p className="text-xs text-zinc-500">{apps.length} lamaran · {unreadCount} belum dibaca</p>
                        </div>
                    </div>
                    <button onClick={() => { setLoading(true); fetchApps() }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-200 transition-all">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input type="text" placeholder="Cari nama, email, posisi..." value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-all" />
                    <div className="flex gap-2">
                        {(['all', 'unread', 'read'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all
                                    ${filter === f ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}>
                                {f === 'all' ? `Semua (${apps.length})` : f === 'unread' ? `Belum Dibaca (${unreadCount})` : `Sudah Dibaca (${apps.length - unreadCount})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-48 bg-zinc-800 rounded-full" />
                                        <div className="h-3 w-32 bg-zinc-800 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800/60 py-16 text-center">
                        <Briefcase className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="font-black text-zinc-400">
                            {apps.length === 0 ? 'Belum ada lamaran masuk' : 'Tidak ada hasil'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(app => (
                            <button key={app.id} onClick={() => handleOpen(app)}
                                className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 hover:border-yellow-400/30
                                    ${app.isRead ? 'bg-zinc-900/40 border-zinc-800/40' : 'bg-zinc-900 border-zinc-800/60'}`}>
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0
                                        ${app.isRead ? 'bg-zinc-800 text-zinc-500' : 'bg-yellow-400 text-black'}`}>
                                        {app.namaLengkap.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`font-black text-sm ${app.isRead ? 'text-zinc-300' : 'text-white'}`}>
                                                    {app.namaLengkap}
                                                </span>
                                                {!app.isRead && <span className="w-2 h-2 bg-yellow-400 rounded-full shrink-0" />}
                                            </div>
                                            <span className="text-xs text-zinc-600 shrink-0">
                                                {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-full">
                                                {app.positionTitle}
                                            </span>
                                            <span className="text-xs text-zinc-500">{app.email}</span>
                                            <span className="text-xs text-zinc-600">{app.usia ? app.usia + ' thn' : ''}</span>
                                            {app.pendidikan && <span className="text-xs text-zinc-600">{app.pendidikan}</span>}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selected && (
                <DetailModal app={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
            )}
        </div>
    )
}