'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Clock, ArrowUpRight, X, CheckCircle, ChevronRight, Loader2, Send } from 'lucide-react'
import { useTheme } from 'next-themes'

// ── Types ─────────────────────────────────────────────────────
interface JobPosition {
    id: string
    title: string
    dept: string
    type: string
    location: string
    desc: string
    requirements: string[]
    isActive: boolean
}

const DEPT_STYLES: Record<string, { card: string; badge: string; dot: string }> = {
    'Kitchen': { card: 'from-orange-400/5', badge: 'bg-orange-400/10 text-orange-400 border-orange-400/20', dot: 'bg-orange-400' },
    'Operations': { card: 'from-blue-400/5', badge: 'bg-blue-400/10 text-blue-400 border-blue-400/20', dot: 'bg-blue-400' },
    'Front of House': { card: 'from-green-400/5', badge: 'bg-green-400/10 text-green-400 border-green-400/20', dot: 'bg-green-400' },
    'Marketing': { card: 'from-pink-400/5', badge: 'bg-pink-400/10 text-pink-400 border-pink-400/20', dot: 'bg-pink-400' },
    'Finance': { card: 'from-purple-400/5', badge: 'bg-purple-400/10 text-purple-400 border-purple-400/20', dot: 'bg-purple-400' },
    'Technology': { card: 'from-cyan-400/5', badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20', dot: 'bg-cyan-400' },
}

const getDeptStyle = (dept: string) =>
    DEPT_STYLES[dept] ?? { card: 'from-yellow-400/5', badge: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20', dot: 'bg-yellow-400' }

// ── Apply Form ────────────────────────────────────────────────
function ApplyForm({ job, onClose, isDark }: { job: JobPosition; onClose: () => void; isDark: boolean }) {
    const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [done, setDone] = useState(false)

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [k]: e.target.value }))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        // Simulate submit — ganti dengan fetch('/api/admin/career/apply', ...) jika ada endpoint
        await new Promise(r => setTimeout(r, 1200))
        setSubmitting(false)
        setDone(true)
    }

    const inp = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-200
        ${isDark
            ? 'bg-zinc-900 border-zinc-700/60 text-white placeholder-zinc-600 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/10'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10'}`

    if (done) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-5">
                <CheckCircle className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Application Sent!</h3>
            <p className={`text-sm max-w-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Thanks! We will review your application for <span className="text-yellow-500 font-bold">{job.title}</span> and get back to you soon.
            </p>
            <button onClick={onClose} className="mt-6 text-yellow-500 text-sm font-bold hover:underline">Close</button>
        </div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>Full Name *</label>
                    <input type="text" required placeholder="John Doe" value={form.name} onChange={set('name')} className={inp} />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>Email *</label>
                    <input type="email" required placeholder="john@email.com" value={form.email} onChange={set('email')} className={inp} />
                </div>
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>Phone</label>
                    <input type="tel" placeholder="+62 812..." value={form.phone} onChange={set('phone')} className={inp} />
                </div>
                <div className="col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>LinkedIn / Portfolio</label>
                    <input type="text" placeholder="https://..." value={form.portfolio} onChange={set('portfolio')} className={inp} />
                </div>
                <div className="col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>Why join us? *</label>
                    <textarea required rows={3} placeholder="Tell us why you'd be a great fit..." value={form.message} onChange={set('message')}
                        className={inp + ' resize-none'} />
                </div>
            </div>
            <div className="flex gap-3 pt-1">
                <button type="submit" disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-black py-3.5 rounded-xl font-black text-sm
                        hover:bg-yellow-300 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-400/20">
                    {submitting
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                        : <><Send className="w-4 h-4" /> Submit Application</>}
                </button>
                <button type="button" onClick={onClose}
                    className={`px-5 rounded-xl font-bold text-sm border transition-all
                        ${isDark ? 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}>
                    Cancel
                </button>
            </div>
        </form>
    )
}

// ── Job Modal ─────────────────────────────────────────────────
function JobModal({ job, onClose, isDark }: { job: JobPosition; onClose: () => void; isDark: boolean }) {
    const [tab, setTab] = useState<'detail' | 'apply'>('detail')
    const style = getDeptStyle(job.dept)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', onKey)
        return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
    }, [onClose])

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className={`relative w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden
                ${isDark ? 'bg-zinc-950 border border-zinc-800/60' : 'bg-white border border-gray-100'}`}>

                {/* Header */}
                <div className={`px-6 pt-6 pb-0 shrink-0 border-b ${isDark ? 'border-zinc-800/60' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>{job.dept}</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1
                                    ${isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                    <Clock className="w-3 h-3" />{job.type}
                                </span>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1
                                    ${isDark ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                    <MapPin className="w-3 h-3" />{job.location}
                                </span>
                            </div>
                            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h2>
                        </div>
                        <button onClick={onClose}
                            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all
                                ${isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 -mb-px">
                        {(['detail', 'apply'] as const).map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all capitalize
                                    ${tab === t
                                        ? isDark
                                            ? 'bg-zinc-900 text-yellow-400 border border-b-zinc-900 border-zinc-800/60'
                                            : 'bg-white text-yellow-600 border border-b-white border-gray-100'
                                        : isDark
                                            ? 'text-zinc-500 hover:text-zinc-300'
                                            : 'text-gray-400 hover:text-gray-600'}`}>
                                {t === 'detail' ? 'Job Details' : 'Apply Now'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className={`flex-1 overflow-y-auto p-6 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
                    {tab === 'detail' ? (
                        <div className="space-y-6">
                            <div>
                                <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>About the Role</p>
                                <p className={`leading-relaxed ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>{job.desc}</p>
                            </div>
                            <div>
                                <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-400'}`}>Requirements</p>
                                <ul className="space-y-2.5">
                                    {job.requirements.map((r, i) => (
                                        <li key={i} className={`flex items-start gap-3 text-sm ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${style.dot}`} />
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button onClick={() => setTab('apply')}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black py-4 rounded-2xl font-black text-sm
                                    hover:bg-yellow-300 hover:scale-[1.01] transition-all shadow-lg shadow-yellow-400/20">
                                Apply for this Position <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <ApplyForm job={job} onClose={onClose} isDark={isDark} />
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Job Card ──────────────────────────────────────────────────
function JobCard({ job, onClick, isDark }: { job: JobPosition; onClick: () => void; isDark: boolean }) {
    const style = getDeptStyle(job.dept)

    return (
        <button onClick={onClick} className={`group w-full text-left rounded-3xl border p-6 transition-all duration-300 relative overflow-hidden
            ${isDark
                ? 'bg-zinc-900/60 border-zinc-800/60 hover:border-yellow-400/30 hover:bg-zinc-900'
                : 'bg-white border-gray-100 hover:border-yellow-400/40 hover:shadow-lg hover:shadow-yellow-400/5 shadow-sm'}`}>

            {/* Gradient tint top-right */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.card} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

            {/* Dept badge */}
            <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>{job.dept}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300
                    group-hover:bg-yellow-400 group-hover:scale-110
                    ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                    <ArrowUpRight className={`w-4 h-4 transition-colors duration-300 group-hover:text-black ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                </div>
            </div>

            {/* Title */}
            <h3 className={`text-lg font-black mb-3 leading-tight group-hover:text-yellow-400 transition-colors duration-200
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {job.title}
            </h3>

            {/* Desc preview */}
            <p className={`text-xs leading-relaxed mb-5 line-clamp-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                {job.desc}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium
                    ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                    <Clock className="w-3 h-3" />{job.type}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium
                    ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                    <MapPin className="w-3 h-3" />{job.location}
                </span>
            </div>
        </button>
    )
}

// ── Skeleton ──────────────────────────────────────────────────
function CardSkeleton({ isDark }: { isDark: boolean }) {
    return (
        <div className={`rounded-3xl border p-6 animate-pulse ${isDark ? 'bg-zinc-900/60 border-zinc-800/60' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between mb-4">
                <div className={`h-6 w-24 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                <div className={`h-8 w-8 rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
            </div>
            <div className={`h-6 w-3/4 rounded-xl mb-3 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
            <div className={`h-3 w-full rounded-full mb-2 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
            <div className={`h-3 w-2/3 rounded-full mb-5 ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
            <div className="flex gap-2">
                <div className={`h-6 w-20 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
                <div className={`h-6 w-28 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`} />
            </div>
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────
export function CareerList() {
    const [jobs, setJobs] = useState<JobPosition[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<JobPosition | null>(null)
    const [filter, setFilter] = useState<string>('All')
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        fetch('/api/admin/career/positions/all')
            .then(r => r.json())
            .then((d: JobPosition[]) => setJobs(d.filter(j => j.isActive)))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    const depts = ['All', ...Array.from(new Set(jobs.map(j => j.dept)))]
    const filtered = filter === 'All' ? jobs : jobs.filter(j => j.dept === filter)

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-yellow-400/20">
                            Open Positions
                        </span>
                        <h2 className={`text-4xl md:text-5xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {loading ? '—' : filtered.length} ROLES
                            <span className="block text-yellow-500">AVAILABLE</span>
                        </h2>
                    </div>
                    <p className={`max-w-xs text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        We hire for attitude and train for skill. Click any role to read more and apply.
                    </p>
                </div>

                {/* Filter tabs */}
                {!loading && depts.length > 2 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {depts.map(d => (
                            <button key={d} onClick={() => setFilter(d)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200
                                    ${filter === d
                                        ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                                        : isDark
                                            ? 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
                                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600'}`}>
                                {d}
                                {d !== 'All' && (
                                    <span className={`ml-1.5 opacity-60`}>
                                        {jobs.filter(j => j.dept === d).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} isDark={isDark} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className={`rounded-3xl border py-20 text-center ${isDark ? 'border-zinc-800/60 bg-zinc-900/40' : 'border-gray-100 bg-white shadow-sm'}`}>
                        <p className={`font-black text-xl mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No openings in this department</p>
                        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Try another filter or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(job => (
                            <JobCard key={job.id} job={job} isDark={isDark} onClick={() => setSelected(job)} />
                        ))}
                    </div>
                )}

                {/* Open Application CTA */}
                <div className={`mt-16 border border-yellow-400/20 rounded-3xl p-10 text-center ${isDark ? 'bg-zinc-950' : 'bg-white shadow-sm'}`}>
                    <p className="text-yellow-500 font-black text-xl mb-2">{"Don't see a fit?"}</p>
                    <p className={`mb-6 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        Send us your CV anyway. We are always on the lookout for great talent.
                    </p>
                    <a href="mailto:career@100hourscurry.com"
                        className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20">
                        Send Open Application <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Modal */}
            {selected && (
                <JobModal job={selected} isDark={isDark} onClose={() => setSelected(null)} />
            )}
        </section>
    )
}