'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    UtensilsCrossed, Tag, BriefcaseBusiness, Users,
    MessageSquare, FileText, TrendingUp, Eye, Clock,
    ChevronRight, Loader2, RefreshCw,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────
interface DashboardData {
    stats: {
        totalMenu: number
        totalPromo: number
        totalPositions: number
        totalApplications: number
        unreadMessages: number
        unreadApplications: number
    }
    recentApplications: {
        id: string
        namaLengkap: string
        positionTitle: string
        email: string
        noTelp: string
        isRead: boolean
        createdAt: string
    }[]
    recentMessages: {
        id: string
        name: string
        email: string
        subject: string
        isRead: boolean
        createdAt: string
    }[]
    monthlyChart: { month: string; count: number }[]
}

// ── Helpers ──────────────────────────────────────────────────
function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Baru saja'
    if (mins < 60) return `${mins} menit lalu`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours} jam lalu`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} hari lalu`
    return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

// ── Bar Chart ────────────────────────────────────────────────
function BarChart({ data }: { data: { month: string; count: number }[] }) {
    const max = Math.max(...data.map(d => d.count), 1)
    return (
        <div className="flex items-end gap-1.5 h-28 w-full">
            {data.map((d, i) => {
                const pct = (d.count / max) * 100
                const isLast = i === data.length - 1
                return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                        <div className="relative w-full flex items-end justify-center" style={{ height: '84px' }}>
                            {d.count > 0 && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 flex justify-center"
                                    style={{ bottom: `${pct}%`, marginBottom: '2px' }}
                                >
                                    <span className="text-[9px] font-black text-yellow-400 bg-zinc-900 px-1 rounded whitespace-nowrap">
                                        {d.count}
                                    </span>
                                </div>
                            )}
                            <div
                                className="w-full rounded-sm transition-all duration-500"
                                style={{
                                    height: `${Math.max(pct, d.count > 0 ? 4 : 1)}%`,
                                    background: isLast
                                        ? 'linear-gradient(to top, #eab308, #fde047)'
                                        : d.count > 0
                                            ? 'rgba(234,179,8,0.35)'
                                            : 'rgba(255,255,255,0.05)',
                                    boxShadow: isLast ? '0 0 12px rgba(234,179,8,0.4)' : 'none',
                                }}
                            />
                        </div>
                        <span className={`text-[9px] font-medium truncate w-full text-center ${isLast ? 'text-yellow-400' : 'text-zinc-600'}`}>
                            {d.month}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
    icon: Icon, label, value, sub, accent, href
}: {
    icon: any, label: string, value: number | string,
    sub?: string, accent?: boolean, href?: string
}) {
    const inner = (
        <div className={`relative overflow-hidden rounded-xl border transition-all duration-200 group cursor-pointer
            ${accent
                ? 'bg-yellow-400 border-yellow-300 hover:bg-yellow-300'
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
            }`}
        >
            {/* texture */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 50%)', backgroundSize: '6px 6px' }} />
            <div className="relative p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${accent ? 'bg-black/10' : 'bg-zinc-800'}`}>
                        <Icon size={18} className={accent ? 'text-black' : 'text-yellow-400'} />
                    </div>
                    {sub && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent ? 'bg-black/10 text-black' : 'bg-yellow-400/10 text-yellow-400'}`}>
                            {sub}
                        </span>
                    )}
                </div>
                <p className={`text-3xl font-black tracking-tight ${accent ? 'text-black' : 'text-white'}`}>
                    {value}
                </p>
                <p className={`text-xs font-semibold mt-1 uppercase tracking-wider ${accent ? 'text-black/60' : 'text-zinc-500'}`}>
                    {label}
                </p>
            </div>
        </div>
    )
    return href ? <Link href={href}>{inner}</Link> : inner
}

// ── Main Page ────────────────────────────────────────────────
export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const fetchData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true)
        try {
            const res = await fetch('/api/admin/dashboard')
            const json = await res.json()
            setData(json)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-yellow-400" size={32} />
                    <p className="text-zinc-500 text-sm font-medium">Memuat dashboard…</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500">Gagal memuat data.</p>
            </div>
        )
    }

    const { stats, recentApplications, recentMessages, monthlyChart } = data
    const totalThisMonth = monthlyChart[monthlyChart.length - 1]?.count ?? 0

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

                {/* ── Header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1 h-6 bg-yellow-400 rounded-full" />
                            <p className="text-xs font-black text-yellow-400 tracking-[3px] uppercase">Admin Panel</p>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <button
                        onClick={() => fetchData(true)}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                {/* ── Stat Grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard icon={UtensilsCrossed} label="Menu Aktif" value={stats.totalMenu} href="/dashboard/sidebar" />
                    <StatCard icon={Tag} label="Promo Aktif" value={stats.totalPromo} href="/dashboard/home/promo" />
                    <StatCard icon={BriefcaseBusiness} label="Posisi Buka" value={stats.totalPositions} href="/dashboard/career/positions" />
                    <StatCard icon={Users} label="Total Lamaran" value={stats.totalApplications} href="/dashboard/career/applications" />
                    <StatCard
                        icon={FileText}
                        label="Lamaran Baru"
                        value={stats.unreadApplications}
                        sub={stats.unreadApplications > 0 ? 'Belum dibaca' : undefined}
                        accent={stats.unreadApplications > 0}
                        href="/dashboard/career/applications"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Pesan Baru"
                        value={stats.unreadMessages}
                        sub={stats.unreadMessages > 0 ? 'Belum dibaca' : undefined}
                        accent={stats.unreadMessages > 0}
                        href="/dashboard/contact"
                    />
                </div>

                {/* ── Chart + Recent Messages ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                    {/* Chart */}
                    <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-sm font-black text-white uppercase tracking-wider">Lamaran per Bulan</h2>
                                <p className="text-xs text-zinc-500 mt-0.5">12 bulan terakhir</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-yellow-400">{totalThisMonth}</p>
                                <p className="text-xs text-zinc-500">bulan ini</p>
                            </div>
                        </div>
                        <BarChart data={monthlyChart} />
                    </div>

                    {/* Recent Messages */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Pesan Terbaru</h2>
                            <Link href="/dashboard/contact/messages" className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-0.5">
                                Semua <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="flex-1 space-y-1 overflow-hidden">
                            {recentMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full py-8 text-zinc-600">
                                    <MessageSquare size={28} className="mb-2 opacity-40" />
                                    <p className="text-xs">Belum ada pesan</p>
                                </div>
                            ) : recentMessages.map((msg) => (
                                <Link
                                    key={msg.id}
                                    href={`/dashboard/contact/messages${msg.id}`}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors group"
                                >
                                    <div className="mt-0.5 w-7 h-7 rounded-full bg-zinc-800 group-hover:bg-zinc-700 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-black text-yellow-400">
                                            {msg.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-semibold text-white truncate">{msg.name}</p>
                                            {!msg.isRead && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 truncate">{msg.subject}</p>
                                        <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1">
                                            <Clock size={9} />
                                            {timeAgo(msg.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Recent Applications ── */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-yellow-400" />
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Lamaran Terbaru</h2>
                        </div>
                        <Link href="/admin/career/applications" className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold flex items-center gap-0.5">
                            Lihat semua <ChevronRight size={12} />
                        </Link>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-zinc-600">
                            <FileText size={32} className="mb-3 opacity-40" />
                            <p className="text-sm">Belum ada lamaran masuk</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-800">
                                            <th className="text-left px-6 py-3 text-xs font-black text-zinc-500 uppercase tracking-wider">Pelamar</th>
                                            <th className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wider">Posisi</th>
                                            <th className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wider">Kontak</th>
                                            <th className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wider">Tanggal</th>
                                            <th className="text-left px-4 py-3 text-xs font-black text-zinc-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentApplications.map((app, i) => (
                                            <tr
                                                key={app.id}
                                                className={`border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors ${i === recentApplications.length - 1 ? 'border-b-0' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                                            <span className="text-xs font-black text-yellow-400">
                                                                {app.namaLengkap.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">{app.namaLengkap}</p>
                                                            <p className="text-xs text-zinc-500">{app.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-xs font-bold px-2.5 py-1 bg-yellow-400/10 text-yellow-400 rounded-full border border-yellow-400/20">
                                                        {app.positionTitle}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-zinc-400 text-sm">{app.noTelp}</td>
                                                <td className="px-4 py-4 text-zinc-500 text-xs">{formatDate(app.createdAt)}</td>
                                                <td className="px-4 py-4">
                                                    {app.isRead ? (
                                                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                            <Eye size={11} /> Dibaca
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                                            Baru
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Link
                                                        href={`/admin/career/applications/${app.id}`}
                                                        className="text-xs text-zinc-500 hover:text-yellow-400 transition-colors font-medium"
                                                    >
                                                        Detail →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden divide-y divide-zinc-800">
                                {recentApplications.map((app) => (
                                    <Link
                                        key={app.id}
                                        href={`/admin/career/applications/${app.id}`}
                                        className="flex items-center gap-3 px-4 py-4 hover:bg-zinc-800/40 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                                            <span className="text-sm font-black text-yellow-400">
                                                {app.namaLengkap.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-white text-sm truncate">{app.namaLengkap}</p>
                                                {!app.isRead && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />}
                                            </div>
                                            <p className="text-xs text-yellow-400 font-medium truncate">{app.positionTitle}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{timeAgo(app.createdAt)}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-zinc-600 shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}