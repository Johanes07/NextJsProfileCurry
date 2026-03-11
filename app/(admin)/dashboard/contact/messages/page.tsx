'use client'

import { useEffect, useState } from 'react'
import {
    Mail, MailOpen, Trash2, RefreshCw, Search, MapPin, Phone,
    Globe, Building2, MessageSquare, Calendar, CheckCheck, AlertCircle, CheckCircle, X
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
      ${type === 'success' ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-red-950 border border-red-500/40 text-red-300'}`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
    )
}

// ── Message Detail Modal ──────────────────────────────────────
function MessageModal({ msg, isDark, onClose, onDelete }: {
    msg: Message; isDark: boolean; onClose: () => void; onDelete: (id: string) => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden
        ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>

                {/* Header */}
                <div className={`px-6 py-5 border-b flex items-start justify-between gap-4 ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                                {msg.subject}
                            </span>
                        </div>
                        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{msg.name}</h2>
                        <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{msg.email}</p>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-gray-100 text-gray-400'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Meta */}
                <div className={`px-6 py-4 border-b grid grid-cols-2 gap-3 ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
                    {[
                        { icon: Phone, label: 'Phone', value: msg.phone || '—' },
                        { icon: Globe, label: 'Country', value: msg.country || '—' },
                        { icon: Building2, label: 'City', value: msg.city || '—' },
                        { icon: Calendar, label: 'Sent', value: new Date(msg.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-yellow-500" />
                            </div>
                            <div>
                                <p className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{label}</p>
                                <p className={`text-sm font-medium ${isDark ? 'text-white/80' : 'text-gray-700'}`}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message body */}
                <div className="px-6 py-5">
                    <p className={`text-xs font-bold tracking-widest mb-3 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>MESSAGE</p>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{msg.message}</p>
                </div>

                {/* Actions */}
                <div className={`px-6 py-4 border-t flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black text-sm font-black rounded-xl hover:bg-yellow-300 transition-all">
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
    const isDark = true // admin always dark

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
        const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q) || m.message.toLowerCase().includes(q)
        const matchFilter = filter === 'all' || (filter === 'unread' && !m.isRead) || (filter === 'read' && m.isRead)
        return matchSearch && matchFilter
    })

    const unreadCount = messages.filter(m => !m.isRead).length

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center relative">
                            <MessageSquare className="w-4 h-4 text-yellow-400" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full text-black text-[10px] font-black flex items-center justify-center">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Contact Inbox</h1>
                            <p className="text-xs text-zinc-500">{messages.length} pesan · {unreadCount} belum dibaca</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <button onClick={markAllRead}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 hover:text-zinc-200 transition-all">
                                <CheckCheck className="w-3.5 h-3.5" /> Tandai Semua Dibaca
                            </button>
                        )}
                        <button onClick={loadMessages} disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-40 transition-all">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari nama, email, subject, pesan..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/40 transition-all" />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'unread', 'read'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${filter === f
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}>
                                {f === 'all' ? `All (${messages.length})` : f === 'unread' ? `Unread (${unreadCount})` : `Read (${messages.length - unreadCount})`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message List */}
                {loading ? (
                    <div className="space-y-3">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-5 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-48 bg-zinc-800 rounded-lg" />
                                        <div className="h-3 w-32 bg-zinc-800 rounded-lg" />
                                        <div className="h-3 w-full bg-zinc-800 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4">
                            <MessageSquare className="w-7 h-7 text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 font-bold">
                            {search ? 'Tidak ada hasil ditemukan' : filter === 'unread' ? 'Tidak ada pesan belum dibaca' : 'Belum ada pesan masuk'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(msg => (
                            <div key={msg.id} onClick={() => openMessage(msg)}
                                className={`group relative bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all hover:border-yellow-400/30 hover:bg-zinc-800/50
                                    ${!msg.isRead ? 'border-yellow-400/20' : 'border-zinc-800/60'}`}>

                                {/* Unread dot */}
                                {!msg.isRead && (
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
                                )}

                                <div className={`flex gap-4 items-start ${!msg.isRead ? 'pl-4' : ''}`}>
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm
                                        ${!msg.isRead ? 'bg-yellow-400/15 border border-yellow-400/30 text-yellow-400' : 'bg-zinc-800 border border-zinc-700 text-zinc-400'}`}>
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div>
                                                <span className={`font-black text-sm ${!msg.isRead ? 'text-white' : 'text-zinc-300'}`}>{msg.name}</span>
                                                <span className={`ml-2 text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>{msg.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs text-zinc-600 tabular-nums">
                                                    {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <button onClick={e => { e.stopPropagation(); deleteMessage(msg.id) }}
                                                    disabled={deleting === msg.id}
                                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all disabled:opacity-40">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-xs font-bold text-yellow-500 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/15">
                                                {msg.subject}
                                            </span>
                                            {(msg.city || msg.country) && (
                                                <span className="flex items-center gap-1 text-xs text-zinc-600">
                                                    <MapPin className="w-3 h-3" />
                                                    {[msg.city, msg.country].filter(Boolean).join(', ')}
                                                </span>
                                            )}
                                        </div>

                                        <p className={`text-sm truncate ${!msg.isRead ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {msg.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Modal */}
            {selected && (
                <MessageModal
                    msg={selected}
                    isDark={isDark}
                    onClose={() => setSelected(null)}
                    onDelete={(id) => { deleteMessage(id); setSelected(null) }}
                />
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    )
}