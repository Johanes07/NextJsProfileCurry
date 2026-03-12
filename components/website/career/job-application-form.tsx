'use client'

import { useState, useRef, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSearchParams } from 'next/navigation'
import {
    User, FileText,
    Plus, Trash2, ChevronDown, CheckCircle, AlertCircle, Loader2, Upload, X
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface PengalamanItem { perusahaan: string; posisi: string; dari: string; sampai: string; alasanKeluar: string }
interface SeminarItem { nama: string; tahun: string; penyelenggara: string }
interface OrgItem { nama: string; jabatan: string; tahun: string }

interface FormData {
    positionTitle: string
    namaLengkap: string; alamatKTP: string; alamatDomisili: string
    email: string; tempatLahir: string; tanggalLahir: string; usia: string
    anakKe: string; dariSaudara: string; nik: string
    agama: string; golDarah: string; jenisKelamin: string; noTelp: string
    kondisiMata: string; tinggiBadan: string; beratBadan: string
    pendidikan: string; lulusTahun: string; statusNikah: string
    bersediaShift: string; puyaTindikTato: string; perokok: string; riwayatPenyakit: string
}

const INIT: FormData = {
    positionTitle: '', namaLengkap: '', alamatKTP: '', alamatDomisili: '',
    email: '', tempatLahir: '', tanggalLahir: '', usia: '',
    anakKe: '', dariSaudara: '', nik: '',
    agama: '', golDarah: '', jenisKelamin: '', noTelp: '',
    kondisiMata: '', tinggiBadan: '', beratBadan: '',
    pendidikan: '', lulusTahun: '', statusNikah: '',
    bersediaShift: '', puyaTindikTato: '', perokok: '', riwayatPenyakit: '',
}

const MAX_SIZE = 200 * 1024

// ── Shared styles ─────────────────────────────────────────────
function useStyles(isDark: boolean) {
    return {
        // Main input
        inp: `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200
            ${isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-300 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'}`,
        // Label
        lbl: `block text-xs font-black uppercase tracking-widest mb-1.5 ${isDark ? 'text-white/40' : 'text-gray-400'}`,
        // Card section (outer)
        card: `rounded-2xl border p-6 space-y-4 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100 shadow-sm'}`,
        // Sub-card inside (e.g. pengalaman item)
        sub: `rounded-xl border p-4 space-y-3 ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-gray-50 border-gray-100'}`,
        // Divider
        div: `border-b mb-6 pb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`,
    }
}

// ── Select Dropdown ───────────────────────────────────────────
function Sel({ label, value, onChange, options, isDark }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; isDark: boolean
}) {
    const { inp, lbl } = useStyles(isDark)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', fn)
        return () => document.removeEventListener('mousedown', fn)
    }, [])

    return (
        <div>
            <label className={lbl}>{label}</label>
            <div className="relative" ref={ref}>
                <button type="button" onClick={() => setOpen(p => !p)}
                    className={`${inp} flex items-center justify-between text-left ${!value ? (isDark ? 'text-white/20' : 'text-gray-300') : ''}`}>
                    <span>{value || 'Pilih...'}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${isDark ? 'text-white/30' : 'text-gray-400'}`} />
                </button>
                {open && (
                    <div className={`absolute z-20 w-full mt-1 rounded-xl border shadow-xl overflow-hidden max-h-56 overflow-y-auto
                        ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-gray-200'}`}>
                        {options.map(o => (
                            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false) }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all
                                    ${value === o ? 'bg-yellow-400 text-black font-black' : isDark ? 'text-white/70 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}>
                                {o}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Radio Group ───────────────────────────────────────────────
function RadioGroup({ label, value, onChange, options, isDark }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]; isDark: boolean
}) {
    const { lbl } = useStyles(isDark)
    return (
        <div>
            <label className={lbl}>{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(o => (
                    <button key={o} type="button" onClick={() => onChange(o)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all
                            ${value === o
                                ? 'bg-yellow-400 text-black border-yellow-400 shadow-sm shadow-yellow-400/20'
                                : isDark
                                    ? 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'}`}>
                        {o}
                    </button>
                ))}
            </div>
        </div>
    )
}

// ── Text / Textarea Field ─────────────────────────────────────
function F({ label, value, onChange, placeholder, type = 'text', textarea, required, isDark }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; type?: string; textarea?: boolean; required?: boolean; isDark: boolean
}) {
    const { inp, lbl } = useStyles(isDark)
    return (
        <div>
            <label className={lbl}>
                {label}{required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    rows={3} className={inp + ' resize-none'} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} required={required} className={inp} />}
        </div>
    )
}

// ── File Upload ───────────────────────────────────────────────
function FileUpload({ label, hint, accept, file, onFile, isDark }: {
    label: string; hint: string; accept: string; file: File | null; onFile: (f: File | null) => void; isDark: boolean
}) {
    const { lbl } = useStyles(isDark)
    const ref = useRef<HTMLInputElement>(null)
    const [err, setErr] = useState('')

    function handle(f: File) {
        if (f.size > MAX_SIZE) { setErr(`File terlalu besar (${(f.size / 1024).toFixed(0)} KB). Maks 200 KB.`); return }
        setErr(''); onFile(f)
    }

    return (
        <div>
            <label className={lbl}>{label}</label>
            <input ref={ref} type="file" accept={accept} className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handle(f); e.target.value = '' }} />
            {file ? (
                <div className={`flex items-center justify-between px-4 py-3 rounded-xl border
                    ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span className={`truncate text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{file.name}</span>
                        <span className={`text-xs shrink-0 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>({(file.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button type="button" onClick={() => onFile(null)}
                        className={`ml-2 transition-colors ${isDark ? 'text-white/30 hover:text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button type="button" onClick={() => ref.current?.click()}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all
                        ${isDark
                            ? 'border-white/10 text-white/30 hover:border-yellow-400/40 hover:text-yellow-400'
                            : 'border-gray-200 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-500'}`}>
                    <Upload className="w-4 h-4" /> Pilih File
                </button>
            )}
            {err && <p className="text-red-400 text-xs mt-1.5">{err}</p>}
            <p className={`text-xs mt-1.5 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>{hint}</p>
        </div>
    )
}

// ── Pengalaman Kerja ──────────────────────────────────────────
function PengalamanEditor({ items, onChange, isDark }: {
    items: PengalamanItem[]; onChange: (v: PengalamanItem[]) => void; isDark: boolean
}) {
    const { inp, lbl, sub } = useStyles(isDark)
    function add() { onChange([...items, { perusahaan: '', posisi: '', dari: '', sampai: '', alasanKeluar: '' }]) }
    function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)) }
    function update(i: number, key: keyof PengalamanItem, val: string) {
        const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n)
    }
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className={sub}>
                    <div className="flex items-center justify-between">
                        <p className={`text-xs font-black tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                            PENGALAMAN #{i + 1}
                        </p>
                        <button type="button" onClick={() => remove(i)}
                            className={`transition-colors ${isDark ? 'text-white/20 hover:text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className={lbl}>Nama Perusahaan</label>
                            <input type="text" value={item.perusahaan} onChange={e => update(i, 'perusahaan', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Posisi / Jabatan</label>
                            <input type="text" value={item.posisi} onChange={e => update(i, 'posisi', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Alasan Keluar</label>
                            <input type="text" value={item.alasanKeluar} onChange={e => update(i, 'alasanKeluar', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Dari</label>
                            <input type="text" placeholder="Jan 2020" value={item.dari} onChange={e => update(i, 'dari', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Sampai</label>
                            <input type="text" placeholder="Des 2022 / Sekarang" value={item.sampai} onChange={e => update(i, 'sampai', e.target.value)} className={inp} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" onClick={add}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all
                    ${isDark
                        ? 'border-white/10 text-white/30 hover:border-yellow-400/40 hover:text-yellow-400'
                        : 'border-gray-200 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-500'}`}>
                <Plus className="w-4 h-4" /> Tambah Pengalaman Kerja
            </button>
        </div>
    )
}

// ── Seminar Editor ────────────────────────────────────────────
function SeminarEditor({ items, onChange, isDark }: {
    items: SeminarItem[]; onChange: (v: SeminarItem[]) => void; isDark: boolean
}) {
    const { inp, lbl, sub } = useStyles(isDark)
    function add() { onChange([...items, { nama: '', tahun: '', penyelenggara: '' }]) }
    function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)) }
    function update(i: number, key: keyof SeminarItem, val: string) {
        const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n)
    }
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className={sub}>
                    <div className="flex items-center justify-between">
                        <p className={`text-xs font-black tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>#{i + 1}</p>
                        <button type="button" onClick={() => remove(i)}
                            className={`transition-colors ${isDark ? 'text-white/20 hover:text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className={lbl}>Nama Seminar / Kursus</label>
                            <input type="text" value={item.nama} onChange={e => update(i, 'nama', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Penyelenggara</label>
                            <input type="text" value={item.penyelenggara} onChange={e => update(i, 'penyelenggara', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Tahun</label>
                            <input type="text" placeholder="2023" value={item.tahun} onChange={e => update(i, 'tahun', e.target.value)} className={inp} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" onClick={add}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all
                    ${isDark
                        ? 'border-white/10 text-white/30 hover:border-yellow-400/40 hover:text-yellow-400'
                        : 'border-gray-200 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-500'}`}>
                <Plus className="w-4 h-4" /> Tambah Seminar / Kursus
            </button>
        </div>
    )
}

// ── Organisasi Editor ─────────────────────────────────────────
function OrgEditor({ items, onChange, isDark }: {
    items: OrgItem[]; onChange: (v: OrgItem[]) => void; isDark: boolean
}) {
    const { inp, lbl, sub } = useStyles(isDark)
    function add() { onChange([...items, { nama: '', jabatan: '', tahun: '' }]) }
    function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)) }
    function update(i: number, key: keyof OrgItem, val: string) {
        const n = [...items]; n[i] = { ...n[i], [key]: val }; onChange(n)
    }
    return (
        <div className="space-y-3">
            {items.map((item, i) => (
                <div key={i} className={sub}>
                    <div className="flex items-center justify-between">
                        <p className={`text-xs font-black tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>#{i + 1}</p>
                        <button type="button" onClick={() => remove(i)}
                            className={`transition-colors ${isDark ? 'text-white/20 hover:text-red-400' : 'text-gray-300 hover:text-red-400'}`}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                            <label className={lbl}>Nama Organisasi / Kegiatan</label>
                            <input type="text" value={item.nama} onChange={e => update(i, 'nama', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Jabatan</label>
                            <input type="text" value={item.jabatan} onChange={e => update(i, 'jabatan', e.target.value)} className={inp} />
                        </div>
                        <div>
                            <label className={lbl}>Tahun</label>
                            <input type="text" placeholder="2021–2023" value={item.tahun} onChange={e => update(i, 'tahun', e.target.value)} className={inp} />
                        </div>
                    </div>
                </div>
            ))}
            <button type="button" onClick={add}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-all
                    ${isDark
                        ? 'border-white/10 text-white/30 hover:border-yellow-400/40 hover:text-yellow-400'
                        : 'border-gray-200 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-500'}`}>
                <Plus className="w-4 h-4" /> Tambah Organisasi / Kegiatan
            </button>
        </div>
    )
}

// ── Section Header ────────────────────────────────────────────
function SectionHeader({ icon: Icon, title, isDark }: { icon: any; title: string; isDark: boolean }) {
    return (
        <div className={`flex items-center gap-3 pb-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className={`font-black text-sm uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
    )
}

// ── Main Form ─────────────────────────────────────────────────
interface Props { positionTitle?: string; positionId?: string }

export function JobApplicationForm({ positionTitle: propTitle, positionId: propId }: Props) {
    const { resolvedTheme } = useTheme()
    const searchParams = useSearchParams()
    const [mounted, setMounted] = useState(false)

    const positionTitle = searchParams.get('position') ?? propTitle ?? ''
    const positionId = searchParams.get('id') ?? propId ?? ''

    const [form, setForm] = useState<FormData>({ ...INIT, positionTitle })
    const [pengalaman, setPengalaman] = useState<PengalamanItem[]>([])
    const [seminar, setSeminar] = useState<SeminarItem[]>([])
    const [organisasi, setOrganisasi] = useState<OrgItem[]>([])
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [fotoFile, setFotoFile] = useState<File | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [result, setResult] = useState<'success' | 'error' | null>(null)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => { setMounted(true) }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true
    const { inp, lbl, card } = useStyles(isDark)
    const set = (k: keyof FormData) => (v: string) => setForm(prev => ({ ...prev, [k]: v }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.namaLengkap || !form.email || !form.nik || !form.noTelp) {
            setErrorMsg('Harap isi semua field yang wajib (*)')
            return
        }
        setSubmitting(true)
        setErrorMsg('')
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => fd.append(k, v))
        fd.append('positionId', positionId ?? '')
        fd.append('pengalamanKerja', JSON.stringify(pengalaman))
        fd.append('seminarKursus', JSON.stringify(seminar))
        fd.append('organisasi', JSON.stringify(organisasi))
        if (cvFile) fd.append('cv', cvFile)
        if (fotoFile) fd.append('foto', fotoFile)
        try {
            const res = await fetch('/api/admin/career/apply', { method: 'POST', body: fd })
            const data = await res.json()
            if (!res.ok) { setErrorMsg(data.error || 'Gagal mengirim lamaran'); setResult('error') }
            else setResult('success')
        } catch {
            setErrorMsg('Terjadi kesalahan. Coba lagi.')
            setResult('error')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ────────────────────────────────────────
    if (result === 'success') {
        return (
            <div className={`min-h-screen py-20 flex flex-col items-center justify-center text-center px-6 transition-colors ${isDark ? 'bg-black' : 'bg-white'}`}>
                <div className="w-20 h-20 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-yellow-400" />
                </div>
                <h2 className={`text-3xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Lamaran Terkirim!</h2>
                <p className={`max-w-sm text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                    Terima kasih, <strong className={isDark ? 'text-white' : 'text-gray-800'}>{form.namaLengkap}</strong>! Lamaran kamu untuk posisi <strong className="text-yellow-500">{form.positionTitle}</strong> sudah kami terima. Kami akan menghubungimu dalam waktu dekat.
                </p>
            </div>
        )
    }

    return (
        <section className={`py-16 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                {/* Page Header */}
                <div className="mb-10">
                    <span className="inline-block bg-yellow-400/10 text-yellow-500 text-xs font-bold px-4 py-2 rounded-full mb-5 border border-yellow-400/20">
                        Form Lamaran Kerja
                    </span>
                    <h2 className={`text-4xl font-black leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        DAFTAR
                        <span className="block text-yellow-500">SEKARANG</span>
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Posisi — readonly */}
                    <div className={`rounded-2xl border p-5 ${isDark ? 'bg-yellow-400/5 border-yellow-400/15' : 'bg-yellow-50 border-yellow-200/60'}`}>
                        <label className={`text-xs font-black uppercase tracking-widest mb-1.5 block ${isDark ? 'text-yellow-400/60' : 'text-yellow-600/70'}`}>
                            Posisi yang Dilamar <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input type="text" readOnly value={form.positionTitle}
                                className={`w-full border rounded-xl px-4 py-3 text-sm font-bold cursor-not-allowed select-none focus:outline-none
                                    ${isDark
                                        ? 'bg-white/5 border-yellow-400/20 text-white'
                                        : 'bg-white border-yellow-200 text-gray-800'}`} />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black px-2 py-0.5 rounded-lg
                                ${isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                                Auto
                            </span>
                        </div>
                    </div>

                    {/* Data Pribadi */}
                    <div className={card}>
                        <SectionHeader icon={User} title="Data Pribadi" isDark={isDark} />
                        <div className="space-y-4">
                            <F label="Nama Lengkap" value={form.namaLengkap} onChange={set('namaLengkap')} required isDark={isDark} placeholder="Sesuai KTP" />
                            <F label="NIK" value={form.nik} onChange={set('nik')} required isDark={isDark} placeholder="16 digit nomor KTP" />
                            <F label="Alamat KTP" value={form.alamatKTP} onChange={set('alamatKTP')} isDark={isDark} textarea placeholder="Alamat lengkap sesuai KTP" />
                            <F label="Alamat Domisili" value={form.alamatDomisili} onChange={set('alamatDomisili')} isDark={isDark} textarea placeholder="Alamat tempat tinggal saat ini (kosongkan jika sama dengan KTP)" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <F label="Email" value={form.email} onChange={set('email')} type="email" required isDark={isDark} placeholder="email@gmail.com" />
                                <F label="No. Telepon" value={form.noTelp} onChange={set('noTelp')} type="tel" required isDark={isDark} placeholder="+62 812..." />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <F label="Tempat Lahir" value={form.tempatLahir} onChange={set('tempatLahir')} isDark={isDark} placeholder="Jakarta" />
                                <F label="Tanggal Lahir" value={form.tanggalLahir} onChange={set('tanggalLahir')} type="date" isDark={isDark} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <F label="Usia" value={form.usia} onChange={set('usia')} isDark={isDark} placeholder="22" />
                                <F label="Anak ke" value={form.anakKe} onChange={set('anakKe')} isDark={isDark} placeholder="1" />
                                <F label="Dari (jml saudara)" value={form.dariSaudara} onChange={set('dariSaudara')} isDark={isDark} placeholder="3" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RadioGroup label="Jenis Kelamin" value={form.jenisKelamin} onChange={set('jenisKelamin')} options={['Laki-laki', 'Perempuan']} isDark={isDark} />
                                <RadioGroup label="Golongan Darah" value={form.golDarah} onChange={set('golDarah')} options={['A', 'B', 'AB', 'O']} isDark={isDark} />
                            </div>
                            <RadioGroup label="Agama" value={form.agama} onChange={set('agama')} options={['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu']} isDark={isDark} />
                            <RadioGroup label="Status Pernikahan" value={form.statusNikah} onChange={set('statusNikah')} options={['Belum Kawin', 'Kawin', 'Cerai']} isDark={isDark} />
                        </div>
                    </div>

                    {/* Fisik & Kondisi */}
                    <div className={card}>
                        <SectionHeader icon={User} title="Fisik & Kondisi" isDark={isDark} />
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <F label="Tinggi Badan (cm)" value={form.tinggiBadan} onChange={set('tinggiBadan')} isDark={isDark} placeholder="170" />
                                <F label="Berat Badan (kg)" value={form.beratBadan} onChange={set('beratBadan')} isDark={isDark} placeholder="65" />
                            </div>
                            <RadioGroup label="Kondisi Mata" value={form.kondisiMata} onChange={set('kondisiMata')} options={['Normal', 'Minus', 'Plus', 'Silinder', 'Buta Warna', 'Lainnya']} isDark={isDark} />
                            <RadioGroup label="Punya Tindik / Tato?" value={form.puyaTindikTato} onChange={set('puyaTindikTato')} options={['Tidak', 'Ya']} isDark={isDark} />
                            <RadioGroup label="Perokok?" value={form.perokok} onChange={set('perokok')} options={['Tidak', 'Ya']} isDark={isDark} />
                            <F label="Riwayat Penyakit" value={form.riwayatPenyakit} onChange={set('riwayatPenyakit')} isDark={isDark} placeholder="Tuliskan jika ada, atau kosongkan jika tidak ada" textarea />
                        </div>
                    </div>

                    {/* Pendidikan & Preferensi */}
                    <div className={card}>
                        <SectionHeader icon={FileText} title="Pendidikan & Preferensi" isDark={isDark} />
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <RadioGroup label="Pendidikan Terakhir" value={form.pendidikan} onChange={set('pendidikan')} options={['SMA/SMK', 'D3', 'S1', 'S2']} isDark={isDark} />
                                <F label="Tahun Lulus" value={form.lulusTahun} onChange={set('lulusTahun')} isDark={isDark} placeholder="2022" />
                            </div>
                            <RadioGroup label="Bersedia Kerja Shift?" value={form.bersediaShift} onChange={set('bersediaShift')} options={['Ya', 'Tidak']} isDark={isDark} />
                        </div>
                    </div>

                    {/* Pengalaman Kerja */}
                    <div className={card}>
                        <SectionHeader icon={FileText} title="Pengalaman Kerja" isDark={isDark} />
                        <PengalamanEditor items={pengalaman} onChange={setPengalaman} isDark={isDark} />
                    </div>

                    {/* Seminar */}
                    <div className={card}>
                        <SectionHeader icon={FileText} title="Seminar / Kursus" isDark={isDark} />
                        <SeminarEditor items={seminar} onChange={setSeminar} isDark={isDark} />
                    </div>

                    {/* Organisasi */}
                    <div className={card}>
                        <SectionHeader icon={User} title="Organisasi / Kegiatan" isDark={isDark} />
                        <OrgEditor items={organisasi} onChange={setOrganisasi} isDark={isDark} />
                    </div>

                    {/* Upload Dokumen */}
                    <div className={card}>
                        <SectionHeader icon={Upload} title="Upload Dokumen" isDark={isDark} />
                        <div className="space-y-5">
                            <FileUpload label="CV (PDF / DOC) *" accept=".pdf,.doc,.docx"
                                hint="Maksimal 200 KB. Jika terlalu besar, kompres di iLovePDF atau SmallPDF"
                                file={cvFile} onFile={setCvFile} isDark={isDark} />
                            <FileUpload label="Foto Full Body *" accept="image/*"
                                hint="Maksimal 200 KB. Jika terlalu besar, kompres di TinyPNG atau Compressor.io"
                                file={fotoFile} onFile={setFotoFile} isDark={isDark} />
                        </div>
                    </div>

                    {/* Error */}
                    {errorMsg && (
                        <div className="flex items-center gap-3 px-4 py-3 bg-red-950/60 border border-red-500/30 rounded-xl">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                            <p className="text-red-300 text-sm">{errorMsg}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={submitting}
                        className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black py-5 rounded-2xl font-black text-lg
                            hover:bg-yellow-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-yellow-400/20
                            disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-yellow-400/20">
                        {submitting
                            ? <><Loader2 className="w-5 h-5 animate-spin" /> Mengirim Lamaran...</>
                            : <>Kirim Lamaran <span className="opacity-60">→</span></>}
                    </button>

                    <p className={`text-xs text-center pb-8 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
                        Dengan mengirim form ini, kamu menyetujui penggunaan data pribadi untuk keperluan rekrutmen 100 Hours Curry.
                    </p>
                </form>
            </div>
        </section>
    )
}