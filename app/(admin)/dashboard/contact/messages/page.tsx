'use client'

import { useEffect, useState } from 'react'
import {
    Mail, Trash2, RefreshCw, Search, MapPin, Phone,
    Globe, Building2, MessageSquare, Calendar, CheckCheck,
    AlertCircle, CheckCircle, X, Loader2
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface Message {
    id: string
    name: string
    phone: string
    email: string
    subject: string
    country: string
    city: string
    message: string
    isRead: boolean
    createdAt: string
}

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl
            ${type === 'success'
                ? 'bg-zinc-950 border border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success'
                ? <CheckCircle className="w-5 h-5 shrink-0" />
                : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-bold">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

// ── Message Detail Modal ──────────────────────────────────────
function MessageModal({ msg, onClose, onDelete }: {
    msg: Message; onClose: () => void; onDelete: (id: string) => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                                {msg.subject}
                            </span>
                        </div>
                        <h2 className="text-lg font-black text-white">{msg.name}</h2>
                        <p className="text-sm text-white/40">{msg.email}</p>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Meta */}
                <div className="px-6 py-4 border-b border-white/5 grid grid-cols-2 gap-3">
                    {[
                        { icon: Phone, label: 'Phone', value: msg.phone || '—' },
                        { icon: Globe, label: 'Country', value: msg.country || '—' },
                        { icon: Building2, label: 'City', value: msg.city || '—' },
                        { icon: Calendar, label: 'Sent', value: new Date(msg.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-yellow-500" />
                            </div>
                            <div>
                                <p className="text-xs text-white/30">{label}</p>
                                <p className="text-sm font-medium text-white/80">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message body */}
                <div className="px-6 py-5">
                    <p className="text-xs font-black tracking-widest text-white/30 mb-3">MESSAGE</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-white/60">{msg.message}</p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center">
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black text-sm font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                        <Mail className="w-4 h-4" /> Reply via Email
                    </a>
                    <button onClick={() => { onDelete(msg.id); onClose() }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Main Inbox CMS ────────────────────────────────────────────
export default function ContactInbox() {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [selected, setSelected] = useState<Message | null>(null)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    async function loadMessages() {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/contact/messages')
            const data = await res.json()
            setMessages(data)
        } catch {
            showToast('Gagal memuat pesan', 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadMessages() }, [])

    async function markRead(id: string) {
        try {
            await fetch(`/api/admin/contact/messages/${id}/read`, { method: 'PATCH' })
            setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
        } catch { }
    }

    async function markAllRead() {
        try {
            await fetch('/api/admin/contact/messages/read-all', { method: 'PATCH' })
            setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
            showToast('Semua pesan ditandai sudah dibaca', 'success')
        } catch {
            showToast('Gagal memperbarui', 'error')
        }
    }

    async function deleteMessage(id: string) {
        setDeleting(id)
        try {
            await fetch(`/api/admin/contact/messages/${id}`, { method: 'DELETE' })
            setMessages(prev => prev.filter(m => m.id !== id))
            showToast('Pesan dihapus', 'success')
        } catch {
            showToast('Gagal menghapus pesan', 'error')
        } finally {
            setDeleting(null)
        }
    }

    function openMessage(msg: Message) {
        setSelected(msg)
        if (!msg.isRead) markRead(msg.id)
    }

    const filtered = messages.filter(m => {
        const q = search.toLowerCase()
        const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
            || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
        const matchFilter = filter === 'all' || (filter === 'unread' && !m.isRead) || (filter === 'read' && m.isRead)
        return matchSearch && matchFilter
    })

    const unreadCount = messages.filter(m => !m.isRead).length

    return (
        <div className="p-8 bg-black min-h-screen text-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white">Contact Inbox</h1>
                        {unreadCount > 0 && (
                            <span className="flex items-center gap-1.5 text-xs font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                {unreadCount} belum dibaca
                            </span>
                        )}
                    </div>
                    <p className="text-white/40 text-sm mt-1">{messages.length} pesan masuk</p>
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <button onClick={markAllRead}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 transition-all">
                            <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
                        </button>
                    )}
                    <button onClick={loadMessages} disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm font-black hover:bg-white/10 hover:text-white/60 disabled:opacity-30 transition-all">
                        {loading
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <RefreshCw className="w-3.5 h-3.5" />}
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama, email, subject, pesan..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-400/50 transition-all" />
                </div>
                <div className="flex gap-2">
                    {(['all', 'unread', 'read'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all
                                ${filter === f
                                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20'
                                    : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'}`}>
                            {f === 'all' ? `All (${messages.length})` : f === 'unread' ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Message List */}
            {loading ? (
                <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white/5 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-white/5 rounded-lg" />
                                    <div className="h-3 w-32 bg-white/5 rounded-lg" />
                                    <div className="h-3 w-full bg-white/5 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center mb-4">
                        <MessageSquare className="w-7 h-7 text-white/20" />
                    </div>
                    <p className="text-white/30 font-bold">
                        {search ? 'Tidak ada hasil ditemukan' : filter === 'unread' ? 'Tidak ada pesan belum dibaca' : 'Belum ada pesan masuk'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(msg => (
                        <div key={msg.id} onClick={() => openMessage(msg)}
                            className={`group relative bg-white/[0.03] border rounded-2xl p-5 cursor-pointer transition-all
                                hover:border-yellow-400/30 hover:bg-white/[0.05]
                                ${!msg.isRead ? 'border-yellow-400/20' : 'border-white/5'}`}>

                            {/* Unread dot */}
                            {!msg.isRead && (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                            )}

                            <div className={`flex gap-4 items-start ${!msg.isRead ? 'pl-4' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm border
                                    ${!msg.isRead
                                        ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                                        : 'bg-white/5 border-white/10 text-white/40'}`}>
                                    {msg.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div>
                                            <span className={`font-black text-sm ${!msg.isRead ? 'text-white' : 'text-white/60'}`}>
                                                {msg.name}
                                            </span>
                                            <span className="ml-2 text-xs text-white/30">{msg.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs text-white/20 tabular-nums">
                                                {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </span>
                                            <button onClick={e => { e.stopPropagation(); deleteMessage(msg.id) }}
                                                disabled={deleting === msg.id}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40">
                                                {deleting === msg.id
                                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    : <Trash2 className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/15 px-2 py-0.5 rounded-full">
                                            {msg.subject}
                                        </span>
                                        {(msg.city || msg.country) && (
                                            <span className="flex items-center gap-1 text-xs text-white/20">
                                                <MapPin className="w-3 h-3" />
                                                {[msg.city, msg.country].filter(Boolean).join(', ')}
                                            </span>
                                        )}
                                    </div>

                                    <p className={`text-sm truncate ${!msg.isRead ? 'text-white/40' : 'text-white/20'}`}>
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Message Modal */}
            {selected && (
                <MessageModal
                    msg={selected}
                    onClose={() => setSelected(null)}
                    onDelete={(id) => { deleteMessage(id); setSelected(null) }}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}