'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, ToggleLeft, ToggleRight, Megaphone } from 'lucide-react'
import MediaUpload from '@/components/admin/media-upload'

type Promo = {
    id: string
    type: string
    src: string
    tag: string
    title: string
    desc: string
    cta: string
    ctaLink: string
    badge: string
    isActive: boolean
    order: number
}

const empty: Omit<Promo, 'id'> = {
    type: 'image',
    src: '',
    tag: '',
    title: '',
    desc: '',
    cta: '',
    ctaLink: '',
    badge: '',
    isActive: true,
    order: 0,
}

export default function PromoAdminPage() {
    const [items, setItems] = useState<Promo[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Promo | null>(null)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/promo')
            const data = await res.json()
            setItems(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fetch error:', error)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchItems() }, [])

    const openCreate = () => {
        setEditing(null)
        setForm(empty)
        setShowModal(true)
    }

    const openEdit = (item: Promo) => {
        setEditing(item)
        setForm({ type: item.type, src: item.src, tag: item.tag, title: item.title, desc: item.desc, cta: item.cta, ctaLink: item.ctaLink, badge: item.badge, isActive: item.isActive, order: item.order })
        setShowModal(true)
    }

    const handleSave = async () => {
        setSaving(true)
        const url = editing ? `/api/admin/promo/${editing.id}` : '/api/admin/promo'
        const method = editing ? 'PUT' : 'POST'
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false)
        setShowModal(false)
        fetchItems()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus promo ini?')) return
        await fetch(`/api/admin/promo/${id}`, { method: 'DELETE' })
        fetchItems()
    }

    const handleToggle = async (item: Promo) => {
        await fetch(`/api/admin/promo/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, isActive: !item.isActive }),
        })
        fetchItems()
    }

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Promo</h1>
                    <p className="text-white/40 text-sm mt-1">{items.length} promo terdaftar</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                    <Plus className="w-4 h-4" /> Tambah Promo
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                    <Megaphone className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Belum ada promo</p>
                </div>
            ) : (
                <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">PROMO</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">TAG / BADGE</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">CTA</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">STATUS</th>
                                <th className="text-right px-6 py-4 text-white/30 text-xs font-black tracking-widest">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.src ? (
                                                item.type === 'video' ? (
                                                    <div className="w-16 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 text-xs font-bold">VIDEO</div>
                                                ) : (
                                                    <img src={item.src} className="w-16 h-10 rounded-xl object-cover" />
                                                )
                                            ) : (
                                                <div className="w-16 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Megaphone className="w-4 h-4 text-white/20" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-black text-sm">{item.title}</p>
                                                <p className="text-white/30 text-xs line-clamp-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400 w-fit">{item.tag || '-'}</span>
                                            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/5 text-white/40 w-fit">{item.badge || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white/60 text-sm font-bold">{item.cta || '-'}</p>
                                        <p className="text-white/20 text-xs line-clamp-1">{item.ctaLink || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => handleToggle(item)} className="transition-all">
                                            {item.isActive
                                                ? <ToggleRight className="w-6 h-6 text-yellow-400" />
                                                : <ToggleLeft className="w-6 h-6 text-white/20" />}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => openEdit(item)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-yellow-400/10 hover:text-yellow-400 text-white/40 transition-all">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-400/10 hover:text-red-400 text-white/40 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">{editing ? 'Edit Promo' : 'Tambah Promo'}</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Tipe */}
                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">TIPE MEDIA</label>
                                <div className="flex gap-2">
                                    {['image', 'video'].map(t => (
                                        <button key={t} onClick={() => setForm({ ...form, type: t, src: '' })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${form.type === t ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                            {t === 'image' ? '🖼 Image' : '🎬 Video'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upload */}
                            <MediaUpload
                                value={form.src}
                                onChange={(url) => setForm({ ...form, src: url })}
                                folder="promo"
                                label={form.type === 'video' ? 'Upload Video' : 'Upload Gambar'}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">TAG</label>
                                    <input value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        placeholder="NEW MENU" />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">BADGE</label>
                                    <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        placeholder="LIMITED" />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">JUDUL</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                    placeholder="Promo Spesial Ramadan" />
                            </div>

                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">DESKRIPSI</label>
                                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 resize-none"
                                    placeholder="Deskripsi promo..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">TEKS TOMBOL</label>
                                    <input value={form.cta} onChange={e => setForm({ ...form, cta: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        placeholder="Pesan Sekarang" />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">LINK TOMBOL</label>
                                    <input value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        placeholder="/menu" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URUTAN</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 w-full">
                                        <input type="checkbox" id="promoActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-yellow-400 w-4 h-4" />
                                        <label htmlFor="promoActive" className="text-white text-sm font-bold cursor-pointer">Aktif</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl font-black hover:bg-white/10 transition-all">
                                Batal
                            </button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}