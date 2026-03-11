'use client'

import { useEffect, useState, useRef } from 'react'
import {
    Briefcase, Plus, Save, Trash2, X, CheckCircle, AlertCircle,
    Eye, EyeOff, Loader2, Mail, Pencil, ToggleLeft, ToggleRight
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface JobPosition {
    id?: string
    title: string
    dept: string
    type: string
    location: string
    desc: string
    requirements: string[]
    isActive: boolean
    hrdEmail: string
}

const EMPTY_JOB = (): JobPosition => ({
    title: '', dept: '', type: 'Full Time', location: 'Jakarta Selatan',
    desc: '', requirements: [''], isActive: true, hrdEmail: '',
})

const DEPT_OPTIONS = ['Kitchen', 'Operations', 'Front of House', 'Marketing', 'Finance', 'Technology', 'HR']
const TYPE_OPTIONS = ['Full Time', 'Part Time', 'Full Time / Part Time', 'Contract', 'Internship', 'Remote']

const DEPT_COLORS: Record<string, string> = {
    'Kitchen': 'bg-orange-400/15 text-orange-400 border-orange-400/20',
    'Operations': 'bg-blue-400/15 text-blue-400 border-blue-400/20',
    'Front of House': 'bg-green-400/15 text-green-400 border-green-400/20',
    'Marketing': 'bg-pink-400/15 text-pink-400 border-pink-400/20',
    'Finance': 'bg-purple-400/15 text-purple-400 border-purple-400/20',
    'Technology': 'bg-cyan-400/15 text-cyan-400 border-cyan-400/20',
    'HR': 'bg-yellow-400/15 text-yellow-400 border-yellow-400/20',
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            ${type === 'success'
                ? 'bg-zinc-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success'
                ? <CheckCircle className="w-5 h-5 shrink-0" />
                : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold">{message}</span>
        </div>
    )
}

// ── Input helpers ─────────────────────────────────────────────
const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition-all'
const labelCls = 'text-white/40 text-xs font-black tracking-widest block mb-2'

function Field({ label, value, onChange, placeholder, textarea, type = 'text' }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; textarea?: boolean; type?: string
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    rows={3} className={inputCls + ' resize-none'} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} className={inputCls} />}
        </div>
    )
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', fn)
        return () => document.removeEventListener('mousedown', fn)
    }, [])

    return (
        <div>
            <label className={labelCls}>{label}</label>
            <div className="relative" ref={ref}>
                <button type="button" onClick={() => setOpen(p => !p)}
                    className={`${inputCls} flex items-center justify-between text-left ${!value ? 'text-white/20' : 'text-white'}`}>
                    <span>{value || 'Pilih...'}</span>
                    <svg className={`w-4 h-4 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {open && (
                    <div className="absolute z-20 w-full mt-1 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                        {options.map(o => (
                            <button key={o} type="button"
                                onClick={() => { onChange(o); setOpen(false) }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all
                                    ${value === o ? 'bg-yellow-400 text-black font-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                                {o}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Requirements Editor ───────────────────────────────────────
function RequirementsEditor({ items, onChange }: { items: string[]; onChange: (v: string[]) => void }) {
    function update(i: number, val: string) { const n = [...items]; n[i] = val; onChange(n) }
    function add() { onChange([...items, '']) }
    function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)) }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className={labelCls + ' mb-0'}>REQUIREMENTS</label>
                <button type="button" onClick={add}
                    className="text-xs text-yellow-400 font-black hover:text-yellow-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Tambah
                </button>
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-white/20 text-sm mt-3 shrink-0">•</span>
                        <input type="text" value={item} placeholder={`Requirement ${i + 1}`}
                            onChange={e => update(i, e.target.value)}
                            className={inputCls + ' flex-1'} />
                        <button type="button" onClick={() => remove(i)} disabled={items.length === 1}
                            className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-30">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Job Form Modal ────────────────────────────────────────────
function JobFormModal({ job, onSave, onClose }: {
    job: JobPosition | null
    onSave: (j: JobPosition) => Promise<void>
    onClose: () => void
}) {
    const [form, setForm] = useState<JobPosition>(job ?? EMPTY_JOB())
    const [saving, setSaving] = useState(false)
    const isNew = !job?.id

    const set = (key: keyof JobPosition) => (val: string | boolean | string[]) =>
        setForm(prev => ({ ...prev, [key]: val }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        await onSave(form)
        setSaving(false)
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', fn)
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h2 className="text-xl font-black text-white">
                        {isNew ? 'Tambah Posisi' : `Edit: ${job?.title}`}
                    </h2>
                    <button onClick={onClose} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <form id="job-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">

                    {/* Active toggle */}
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                        <input type="checkbox" id="isActive" checked={form.isActive}
                            onChange={e => set('isActive')(e.target.checked)}
                            className="accent-yellow-400 w-4 h-4" />
                        <label htmlFor="isActive" className="text-white text-sm font-bold cursor-pointer">Aktif — tampil di halaman career</label>
                    </div>

                    <Field label="JOB TITLE *" value={form.title} onChange={set('title')} placeholder="e.g. Head Chef" />

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="DEPARTMENT *" value={form.dept} onChange={set('dept')} options={DEPT_OPTIONS} />
                        <SelectField label="TIPE PEKERJAAN *" value={form.type} onChange={set('type')} options={TYPE_OPTIONS} />
                    </div>

                    <Field label="LOKASI *" value={form.location} onChange={set('location')} placeholder="e.g. Jakarta Selatan" />
                    <Field label="DESKRIPSI POSISI *" value={form.desc} onChange={set('desc')}
                        placeholder="Describe the role and responsibilities..." textarea />

                    <RequirementsEditor items={form.requirements.length ? form.requirements : ['']}
                        onChange={val => set('requirements')(val)} />

                    <div className="border-t border-white/5 pt-4">
                        <label className={labelCls}>EMAIL PENERIMA LAMARAN</label>
                        <input
                            type="email"
                            value={form.hrdEmail}
                            onChange={e => set('hrdEmail')(e.target.value)}
                            placeholder="e.g. kitchen-hrd@100hourscurry.com"
                            className={inputCls}
                        />
                        <p className="text-xs text-white/20 mt-1.5">Kosongkan untuk pakai email default dari .env</p>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose}
                        className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl font-black hover:bg-white/10 transition-all">
                        Batal
                    </button>
                    <button form="job-form" type="submit" disabled={saving || !form.title || !form.dept}
                        className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:scale-100 shadow-lg shadow-yellow-400/20">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <>{isNew ? 'Tambah Posisi' : 'Simpan'}</>}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Job Card (grid style, like sosmed) ────────────────────────
function JobCard({ job, onEdit, onDelete, onToggle }: {
    job: JobPosition & { id: string }
    onEdit: () => void
    onDelete: () => void
    onToggle: () => void
}) {
    const [deleting, setDeleting] = useState(false)
    const deptStyle = DEPT_COLORS[job.dept] ?? 'bg-white/10 text-white/40 border-white/10'

    async function confirmDelete() {
        if (!confirm(`Hapus posisi "${job.title}"?`)) return
        setDeleting(true)
        await onDelete()
        setDeleting(false)
    }

    return (
        <div className="relative group rounded-2xl overflow-hidden border border-white/5 bg-white/[0.03] flex flex-col p-4">

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <span className={`self-start text-xs font-black px-2.5 py-1 rounded-full border mb-3 ${deptStyle}`}>
                    {job.dept || '—'}
                </span>
                <h3 className="text-white font-black text-sm leading-tight mb-1.5 line-clamp-2">{job.title}</h3>
                <p className="text-white/30 text-xs">{job.type}</p>
                <p className="text-white/30 text-xs">{job.location}</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
                <Mail className="w-3 h-3 text-white/20 shrink-0" />
                <span className="text-xs text-white/20 truncate">
                    {job.hrdEmail || 'Default'}
                </span>
            </div>

            {/* NONAKTIF badge */}
            {!job.isActive && (
                <div className="absolute top-3 right-3">
                    <span className="bg-red-500/80 text-white text-xs font-black px-2 py-0.5 rounded-lg">NONAKTIF</span>
                </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                <button onClick={onToggle}
                    title={job.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                    {job.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={onEdit}
                    className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={confirmDelete} disabled={deleting}
                    className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all disabled:opacity-40">
                    {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    )
}

// ── Main CMS ──────────────────────────────────────────────────
export default function CareerPositionsCMS() {
    const [jobs, setJobs] = useState<(JobPosition & { id: string })[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState<JobPosition | null | 'new'>(null)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function fetchJobs() {
        try {
            const res = await fetch('/api/admin/career/positions/all')
            const data = await res.json()
            setJobs(data)
        } catch { showToast('Gagal memuat data', 'error') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchJobs() }, [])

    async function handleSave(form: JobPosition) {
        const isNew = !form.id
        try {
            const res = await fetch(
                isNew ? '/api/admin/career/positions/all' : `/api/admin/career/positions/all/${form.id}`,
                { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }
            )
            if (!res.ok) throw new Error()
            await fetchJobs()
            setModal(null)
            showToast(isNew ? 'Posisi berhasil ditambahkan!' : 'Posisi berhasil diperbarui!', 'success')
        } catch { showToast('Gagal menyimpan posisi', 'error') }
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/admin/career/positions/all/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            await fetchJobs()
            showToast('Posisi berhasil dihapus', 'success')
        } catch { showToast('Gagal menghapus posisi', 'error') }
    }

    async function handleToggle(job: JobPosition & { id: string }) {
        try {
            const res = await fetch(`/api/admin/career/positions/all/${job.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...job, isActive: !job.isActive }),
            })
            if (!res.ok) throw new Error()
            await fetchJobs()
            showToast(!job.isActive ? 'Posisi diaktifkan' : 'Posisi dinonaktifkan', 'success')
        } catch { showToast('Gagal mengubah status', 'error') }
    }

    const filtered = jobs.filter(j =>
        filter === 'all' ? true : filter === 'active' ? j.isActive : !j.isActive
    )
    const activeCount = jobs.filter(j => j.isActive).length

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Career Positions</h1>
                    <p className="text-white/40 text-sm mt-1">{activeCount} aktif · {jobs.length} total</p>
                </div>
                <button onClick={() => setModal('new')}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                    <Plus className="w-4 h-4" /> Tambah Posisi
                </button>
            </div>

            {/* Filter pills */}
            <div className="flex gap-2 mb-6">
                {(['all', 'active', 'inactive'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-black border transition-all
                            ${filter === f
                                ? 'bg-yellow-400 text-black border-yellow-400'
                                : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'}`}>
                        {f === 'all' ? `Semua (${jobs.length})` : f === 'active' ? `Aktif (${activeCount})` : `Nonaktif (${jobs.length - activeCount})`}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                    <Briefcase className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">
                        {jobs.length === 0 ? 'Belum ada posisi' : 'Tidak ada posisi di filter ini'}
                    </p>
                    {jobs.length === 0 && (
                        <button onClick={() => setModal('new')}
                            className="mt-4 px-5 py-2.5 bg-yellow-400 text-black rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                            + Tambah Posisi Pertama
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filtered.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            onEdit={() => setModal(job)}
                            onDelete={() => handleDelete(job.id)}
                            onToggle={() => handleToggle(job)}
                        />
                    ))}
                </div>
            )}

            {modal !== null && (
                <JobFormModal
                    job={modal === 'new' ? null : modal as JobPosition}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}