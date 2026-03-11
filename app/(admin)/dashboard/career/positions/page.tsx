'use client'

import { useEffect, useState, useRef } from 'react'
import {
    Briefcase, Plus, Save, Trash2, X, CheckCircle, AlertCircle,
    Eye, EyeOff, Loader2, Mail
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
    'Kitchen': 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    'Operations': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    'Front of House': 'bg-green-400/10 text-green-400 border-green-400/20',
    'Marketing': 'bg-pink-400/10 text-pink-400 border-pink-400/20',
    'Finance': 'bg-purple-400/10 text-purple-400 border-purple-400/20',
    'Technology': 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    'HR': 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            ${type === 'success' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-red-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{message}</span>
        </div>
    )
}

// ── Input helpers ─────────────────────────────────────────────
const inputCls = 'w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 transition-all'
const labelCls = 'block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5'

function Field({ label, value, onChange, placeholder, textarea, type = 'text', hint }: {
    label: string; value: string; onChange: (v: string) => void
    placeholder?: string; textarea?: boolean; type?: string; hint?: string
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                    rows={3} className={inputCls + ' resize-none'} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} className={inputCls} />}
            {hint && <p className="text-xs text-zinc-600 mt-1.5">{hint}</p>}
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
                    className={`${inputCls} flex items-center justify-between text-left ${!value ? 'text-zinc-600' : 'text-white'}`}>
                    <span>{value || 'Pilih...'}</span>
                    <svg className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {open && (
                    <div className="absolute z-20 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl">
                        {options.map(o => (
                            <button key={o} type="button"
                                onClick={() => { onChange(o); setOpen(false) }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all
                                    ${value === o ? 'bg-yellow-400 text-black font-black' : 'text-zinc-300 hover:bg-zinc-800'}`}>
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
            <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls + ' mb-0'}>Requirements</label>
                <button type="button" onClick={add}
                    className="text-xs text-yellow-400 font-bold hover:text-yellow-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Tambah
                </button>
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <span className="text-zinc-600 text-sm mt-2.5 shrink-0">•</span>
                        <input type="text" value={item} placeholder={`Requirement ${i + 1}`}
                            onChange={e => update(i, e.target.value)}
                            className={inputCls + ' flex-1'} />
                        <button type="button" onClick={() => remove(i)} disabled={items.length === 1}
                            className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-30">
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/60 shadow-2xl overflow-hidden">

                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-zinc-800/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-yellow-400" />
                        </div>
                        <h2 className="text-base font-bold text-white">
                            {isNew ? 'Tambah Posisi Baru' : `Edit: ${job?.title}`}
                        </h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Modal Body */}
                <form id="job-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Active toggle */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${form.isActive ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-zinc-900 border-zinc-800'}`}>
                        <div>
                            <p className="text-sm font-bold text-white">Status Posisi</p>
                            <p className={`text-xs mt-0.5 ${form.isActive ? 'text-yellow-400' : 'text-zinc-500'}`}>
                                {form.isActive ? 'Aktif — tampil di halaman career' : 'Nonaktif — tersembunyi dari publik'}
                            </p>
                        </div>
                        <button type="button"
                            onClick={() => set('isActive')(!form.isActive)}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.isActive ? 'bg-yellow-400' : 'bg-zinc-700'}`}>
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${form.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    {/* Title */}
                    <Field label="Job Title *" value={form.title} onChange={set('title')} placeholder="e.g. Head Chef" />

                    {/* Dept + Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Department *" value={form.dept} onChange={set('dept')} options={DEPT_OPTIONS} />
                        <SelectField label="Tipe Pekerjaan *" value={form.type} onChange={set('type')} options={TYPE_OPTIONS} />
                    </div>

                    {/* Location */}
                    <Field label="Lokasi *" value={form.location} onChange={set('location')} placeholder="e.g. Jakarta Selatan" />

                    {/* Description */}
                    <Field label="Deskripsi Posisi *" value={form.desc} onChange={set('desc')}
                        placeholder="Describe the role and responsibilities..." textarea />

                    {/* Requirements */}
                    <RequirementsEditor items={form.requirements.length ? form.requirements : ['']}
                        onChange={val => set('requirements')(val)} />

                    {/* HRD Email — divider + section */}
                    <div className="pt-2">
                        <div className="border-t border-zinc-800/60 mb-5" />
                        <div className={`rounded-2xl border p-4 mb-4 ${form.hrdEmail ? 'bg-yellow-400/5 border-yellow-400/20' : 'bg-zinc-900 border-zinc-800'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                                <p className="text-sm font-bold text-white">Email Penerima Lamaran</p>
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">
                                Lamaran untuk posisi ini akan dikirim ke email berikut. Kosongkan untuk menggunakan email default dari .env (<code className="text-zinc-400">HRD_EMAIL</code>).
                            </p>
                            <input
                                type="email"
                                value={form.hrdEmail}
                                onChange={e => set('hrdEmail')(e.target.value)}
                                placeholder="e.g. kitchen-hrd@100hourscurry.com"
                                className={inputCls}
                            />
                        </div>
                    </div>

                </form>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-zinc-800/60 flex gap-3 shrink-0 bg-zinc-950">
                    <button form="job-form" type="submit" disabled={saving || !form.title || !form.dept}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black py-3 rounded-xl font-black text-sm
                            hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-400/20">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> {isNew ? 'Tambah Posisi' : 'Simpan Perubahan'}</>}
                    </button>
                    <button type="button" onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-bold hover:border-zinc-500 hover:text-zinc-200 transition-all">
                        Batal
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Job Row Card ──────────────────────────────────────────────
function JobRow({ job, onEdit, onDelete, onToggle }: {
    job: JobPosition & { id: string }
    onEdit: () => void
    onDelete: () => void
    onToggle: () => void
}) {
    const [deleting, setDeleting] = useState(false)
    const deptStyle = DEPT_COLORS[job.dept] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'

    async function confirmDelete() {
        if (!confirm(`Hapus posisi "${job.title}"?`)) return
        setDeleting(true)
        await onDelete()
        setDeleting(false)
    }

    return (
        <div className={`bg-zinc-900 border rounded-2xl px-5 py-4 flex items-center gap-4 transition-all
            ${job.isActive ? 'border-zinc-800/60' : 'border-zinc-800/30 opacity-50'}`}>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-white">{job.title}</h3>
                    {!job.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">Nonaktif</span>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${deptStyle}`}>{job.dept}</span>
                    <span className="text-xs text-zinc-500 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700">{job.type}</span>
                    <span className="text-xs text-zinc-500 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700">{job.location}</span>
                </div>
                {/* Email penerima */}
                <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-zinc-600 shrink-0" />
                    <span className="text-xs text-zinc-600">
                        {job.hrdEmail || <span className="italic">Default (HRD_EMAIL)</span>}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <button onClick={onToggle} title={job.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all
                        ${job.isActive ? 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}>
                    {job.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={onEdit}
                    className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white flex items-center justify-center transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button onClick={confirmDelete} disabled={deleting}
                    className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-600 hover:bg-red-400/10 hover:text-red-400 flex items-center justify-center transition-all disabled:opacity-40">
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                {
                    method: isNew ? 'POST' : 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form),
                }
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
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Career Positions</h1>
                            <p className="text-xs text-zinc-500">{activeCount} posisi aktif · {jobs.length} total</p>
                        </div>
                    </div>
                    <button onClick={() => setModal('new')}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 text-black text-sm font-black
                            hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
                        <Plus className="w-4 h-4" /> Tambah Posisi
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Posisi', value: jobs.length, color: 'text-white' },
                        { label: 'Aktif', value: activeCount, color: 'text-yellow-400' },
                        { label: 'Nonaktif', value: jobs.length - activeCount, color: 'text-zinc-500' },
                    ].map(s => (
                        <div key={s.label} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5">
                            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filter */}
                <div className="flex gap-2 mb-5">
                    {(['all', 'active', 'inactive'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all
                                ${filter === f
                                    ? 'bg-yellow-400 text-black border-yellow-400'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'}`}>
                            {f === 'all' ? `Semua (${jobs.length})` : f === 'active' ? `Aktif (${activeCount})` : `Nonaktif (${jobs.length - activeCount})`}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl px-5 py-4 animate-pulse">
                                <div className="h-4 w-48 bg-zinc-800 rounded-full mb-2" />
                                <div className="flex gap-2">
                                    <div className="h-5 w-20 bg-zinc-800 rounded-full" />
                                    <div className="h-5 w-24 bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800/60 py-16 text-center">
                        <Briefcase className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                        <p className="font-black text-zinc-400 mb-1">
                            {jobs.length === 0 ? 'Belum ada posisi' : 'Tidak ada posisi di filter ini'}
                        </p>
                        {jobs.length === 0 && (
                            <button onClick={() => setModal('new')}
                                className="mt-4 px-5 py-2 bg-yellow-400 text-black rounded-xl font-black text-sm hover:bg-yellow-300 transition-all">
                                + Tambah Posisi Pertama
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(job => (
                            <JobRow
                                key={job.id}
                                job={job}
                                onEdit={() => setModal(job)}
                                onDelete={() => handleDelete(job.id)}
                                onToggle={() => handleToggle(job)}
                            />
                        ))}
                    </div>
                )}
            </div>

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