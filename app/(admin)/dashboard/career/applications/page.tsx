'use client'

import { useEffect, useState } from 'react'
import { Briefcase, Mail, Eye, Trash2, X, Download, Loader2, RefreshCw, Search } from 'lucide-react'

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
            <span className="text-white/30 text-xs w-36 shrink-0 pt-0.5">{label}</span>
            <span className="text-white/80 text-sm font-medium flex-1">{value}</span>
        </div>
    ) : null

    const pengalaman = Array.isArray(app.pengalamanKerja) ? app.pengalamanKerja : []
    const seminar = Array.isArray(app.seminarKursus) ? app.seminarKursus : []
    const org = Array.isArray(app.organisasi) ? app.organisasi : []

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                                {app.positionTitle}
                            </span>
                            <span className="text-xs text-white/20">
                                {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h2 className="text-xl font-black text-white">{app.namaLengkap}</h2>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                            <span className="text-xs text-white/40">{app.email}</span>
                            <span className="text-white/20">·</span>
                            <span className="text-xs text-white/40">{app.noTelp}</span>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60 flex items-center justify-center transition-all shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">

                    {/* Data Pribadi */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
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
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
                        <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Alamat</p>
                        {row('Alamat KTP', app.alamatKTP)}
                        {row('Domisili', app.alamatDomisili)}
                    </div>

                    {/* Fisik */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
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
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Pengalaman Kerja</p>
                            <div className="space-y-4">
                                {pengalaman.map((p: any, i: number) => (
                                    <div key={i} className="border-l-2 border-yellow-400/30 pl-4">
                                        <p className="text-sm font-bold text-white">{p.perusahaan}</p>
                                        <p className="text-xs text-white/40">{p.posisi} · {p.dari} s/d {p.sampai}</p>
                                        {p.alasanKeluar && <p className="text-xs text-white/20 mt-1">Alasan keluar: {p.alasanKeluar}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seminar */}
                    {seminar.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Seminar / Kursus</p>
                            <div className="space-y-2">
                                {seminar.map((s: any, i: number) => (
                                    <p key={i} className="text-sm text-white/60">
                                        <span className="font-bold text-white/80">{s.nama}</span> — {s.penyelenggara} ({s.tahun})
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Org */}
                    {org.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Organisasi / Kegiatan</p>
                            <div className="space-y-2">
                                {org.map((o: any, i: number) => (
                                    <p key={i} className="text-sm text-white/60">
                                        <span className="font-bold text-white/80">{o.nama}</span> — {o.jabatan} ({o.tahun})
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files */}
                    {(app.cvFileName || app.fotoFileName) && (
                        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                            <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Dokumen Terlampir</p>
                            <div className="space-y-3">

                                {app.cvFileName && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-4 h-4 text-yellow-400 shrink-0" />
                                            <span className="text-sm text-white/60 flex-1 truncate">{app.cvFileName}</span>
                                            <div className="flex gap-2 shrink-0">
                                                <a href={`/api/admin/career/applications/${app.id}/file/cv`} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:scale-105 transition-all">
                                                    <Eye className="w-3 h-3" /> Buka
                                                </a>
                                                <a href={`/api/admin/career/applications/${app.id}/file/cv`} download={app.cvFileName}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 text-white/60 text-xs font-black rounded-lg hover:bg-white/20 transition-all">
                                                    <Download className="w-3 h-3" /> Unduh
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {app.fotoFileName && (
                                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Eye className="w-4 h-4 text-yellow-400 shrink-0" />
                                            <span className="text-sm text-white/60 flex-1 truncate">{app.fotoFileName}</span>
                                            <div className="flex gap-2 shrink-0">
                                                <a href={`/api/admin/career/applications/${app.id}/file/foto`} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 text-black text-xs font-black rounded-lg hover:scale-105 transition-all">
                                                    <Eye className="w-3 h-3" /> Buka
                                                </a>
                                                <a href={`/api/admin/career/applications/${app.id}/file/foto`} download={app.fotoFileName}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/10 text-white/60 text-xs font-black rounded-lg hover:bg-white/20 transition-all">
                                                    <Download className="w-3 h-3" /> Unduh
                                                </a>
                                            </div>
                                        </div>
                                        {/\.(jpg|jpeg|png|webp)$/i.test(app.fotoFileName) && (
                                            <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                                                <img src={`/api/admin/career/applications/${app.id}/file/foto`}
                                                    alt={`Foto ${app.namaLengkap}`} className="w-full max-h-72 object-cover" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 flex gap-3 shrink-0">
                    <a href={`mailto:${app.email}?subject=Re: Lamaran ${app.positionTitle}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                        <Mail className="w-4 h-4" /> Balas via Email
                    </a>
                    <button onClick={handleDelete} disabled={deleting}
                        className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:border-red-500/40 hover:text-red-400 hover:bg-red-400/5 disabled:opacity-40 transition-all flex items-center gap-2">
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
        <div className="p-8 bg-black min-h-screen text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white">Inbox Lamaran</h1>
                        {unreadCount > 0 && (
                            <span className="flex items-center gap-1.5 text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                {unreadCount} belum dibaca
                            </span>
                        )}
                    </div>
                    <p className="text-white/40 text-sm mt-1">{apps.length} lamaran masuk</p>
                </div>
                <button onClick={() => { setLoading(true); fetchApps() }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" placeholder="Cari nama, email, posisi..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition-all" />
                </div>
                <div className="flex gap-2">
                    {(['all', 'unread', 'read'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all
                                ${filter === f
                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                    : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'}`}>
                            {f === 'all' ? `Semua (${apps.length})` : f === 'unread' ? `Belum Dibaca (${unreadCount})` : `Sudah Dibaca (${apps.length - unreadCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-white/5 rounded-full" />
                                    <div className="h-3 w-32 bg-white/5 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl py-16 text-center">
                    <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="font-black text-white/30">
                        {apps.length === 0 ? 'Belum ada lamaran masuk' : 'Tidak ada hasil'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(app => (
                        <button key={app.id} onClick={() => handleOpen(app)}
                            className={`w-full text-left rounded-2xl border p-5 transition-all hover:border-yellow-400/30
                                ${app.isRead
                                    ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                                    : 'bg-white/[0.03] border-yellow-400/20 hover:bg-white/[0.05]'}`}>
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 border
                                    ${app.isRead
                                        ? 'bg-white/5 border-white/10 text-white/40'
                                        : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'}`}>
                                    {app.namaLengkap.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-black text-sm ${app.isRead ? 'text-white/60' : 'text-white'}`}>
                                                {app.namaLengkap}
                                            </span>
                                            {!app.isRead && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shrink-0" />}
                                        </div>
                                        <span className="text-xs text-white/20 shrink-0">
                                            {new Date(app.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/15 px-2.5 py-0.5 rounded-full">
                                            {app.positionTitle}
                                        </span>
                                        <span className="text-xs text-white/30">{app.email}</span>
                                        {app.usia && <span className="text-xs text-white/20">{app.usia} thn</span>}
                                        {app.pendidikan && <span className="text-xs text-white/20">{app.pendidikan}</span>}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {selected && (
                <DetailModal app={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
            )}
        </div>
    )
}