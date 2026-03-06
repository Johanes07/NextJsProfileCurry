'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, ToggleLeft, ToggleRight, Instagram, Play } from 'lucide-react'
import MediaUpload from '@/components/admin/media-upload'

type SosmedPost = {
    id: string
    type: string
    src: string
    link: string
    order: number
    isActive: boolean
}

const empty: Omit<SosmedPost, 'id'> = {
    type: 'image',
    src: '',
    link: '',
    order: 0,
    isActive: true,
}

export default function SosmedAdminPage() {
    const [items, setItems] = useState<SosmedPost[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<SosmedPost | null>(null)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/sosmed')
            const data = await res.json()
            setItems(Array.isArray(data) ? data : [])
        } catch {
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchItems() }, [])

    const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true) }
    const openEdit = (item: SosmedPost) => {
        setEditing(item)
        setForm({ type: item.type, src: item.src, link: item.link, order: item.order, isActive: item.isActive })
        setShowModal(true)
    }

    const handleSave = async () => {
        setSaving(true)
        const url = editing ? `/api/admin/sosmed/${editing.id}` : '/api/admin/sosmed'
        const method = editing ? 'PUT' : 'POST'
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false)
        setShowModal(false)
        fetchItems()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus post ini?')) return
        await fetch(`/api/admin/sosmed/${id}`, { method: 'DELETE' })
        fetchItems()
    }

    const handleToggle = async (item: SosmedPost) => {
        await fetch(`/api/admin/sosmed/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, isActive: !item.isActive }),
        })
        fetchItems()
    }

    return (
        <div className="p-8 bg-black min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Instagram Feed</h1>
                    <p className="text-white/40 text-sm mt-1">{items.length} post terdaftar</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                    <Plus className="w-4 h-4" /> Tambah Post
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                    <Instagram className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Belum ada post</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {items.map((item) => (
                        <div key={item.id} className="relative group rounded-2xl overflow-hidden border border-white/5 aspect-square">
                            {item.src ? (
                                <img src={item.src} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                    <Instagram className="w-8 h-8 text-white/20" />
                                </div>
                            )}

                            {item.type === 'video' && (
                                <div className="absolute top-2 right-2">
                                    <div className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center">
                                        <Play className="w-3 h-3 text-white fill-white" />
                                    </div>
                                </div>
                            )}

                            {!item.isActive && (
                                <div className="absolute top-2 left-2">
                                    <span className="bg-red-500/80 text-white text-xs font-black px-2 py-1 rounded-lg">NONAKTIF</span>
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                <button onClick={() => handleToggle(item)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                                    {item.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                                </button>
                                <button onClick={() => openEdit(item)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-red-500 transition-all">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">{editing ? 'Edit Post' : 'Tambah Post'}</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">TIPE</label>
                                <div className="flex gap-2">
                                    {['image', 'video'].map(t => (
                                        <button key={t} onClick={() => setForm({ ...form, type: t, src: '' })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-black transition-all ${form.type === t ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white/40 border border-white/10'}`}>
                                            {t === 'image' ? '🖼 Image' : '🎬 Video'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <MediaUpload
                                value={form.src}
                                onChange={(url) => setForm({ ...form, src: url })}
                                folder="sosmed"
                                label="Upload Gambar / Thumbnail"
                            />

                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">LINK INSTAGRAM</label>
                                <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                    placeholder="https://www.instagram.com/p/xxx" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URUTAN</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                                <div className="flex items-end pb-1">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 w-full">
                                        <input type="checkbox" id="sosmedActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-yellow-400 w-4 h-4" />
                                        <label htmlFor="sosmedActive" className="text-white text-sm font-bold cursor-pointer">Aktif</label>
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