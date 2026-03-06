'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, UtensilsCrossed, ToggleLeft, ToggleRight } from 'lucide-react'
import MediaUpload from '@/components/admin/media-upload'

type MenuItem = {
    id: string
    name: string
    desc: string
    price: string
    category: string
    spice: string
    imageUrl: string
    isActive: boolean
    order: number
}

const categories = [
    { value: 'maindish', label: 'Main Dish' },
    { value: 'sidedish', label: 'Side Dish' },
    { value: 'hot', label: 'Hot Drinks' },
    { value: 'iced', label: 'Iced Drinks' },
]

const spiceLevels = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot']

const catColor: Record<string, string> = {
    maindish: 'bg-orange-400/10 text-orange-400',
    sidedish: 'bg-yellow-400/10 text-yellow-400',
    hot: 'bg-red-400/10 text-red-400',
    iced: 'bg-blue-400/10 text-blue-400',
}

const empty: Omit<MenuItem, 'id'> = {
    name: '', desc: '', price: '', category: 'maindish',
    spice: '', imageUrl: '', isActive: true, order: 0,
}

// Format angka ke Rp 85.000
const formatRupiah = (value: string) => {
    const angka = value.replace(/\D/g, '')
    if (!angka) return ''
    return 'Rp ' + Number(angka).toLocaleString('id-ID')
}

// Ambil angka saja dari string Rp
const parseRupiah = (value: string) => {
    return value.replace(/\D/g, '')
}

export default function MenuAdminPage() {
    const [items, setItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filterCat, setFilterCat] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<MenuItem | null>(null)
    const [form, setForm] = useState(empty)
    const [saving, setSaving] = useState(false)
    const [priceDisplay, setPriceDisplay] = useState('')

    const fetchItems = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/menu')
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
        setPriceDisplay('')
        setShowModal(true)
    }

    const openEdit = (item: MenuItem) => {
        setEditing(item)
        setForm({ name: item.name, desc: item.desc, price: item.price, category: item.category, spice: item.spice, imageUrl: item.imageUrl, isActive: item.isActive, order: item.order })
        setPriceDisplay(item.price ? formatRupiah(parseRupiah(item.price)) : '')
        setShowModal(true)
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = parseRupiah(e.target.value)
        const formatted = formatRupiah(raw)
        setPriceDisplay(formatted)
        setForm({ ...form, price: formatted })
    }

    const handleSave = async () => {
        setSaving(true)
        const url = editing ? `/api/admin/menu/${editing.id}` : '/api/admin/menu'
        const method = editing ? 'PUT' : 'POST'
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false)
        setShowModal(false)
        fetchItems()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus item ini?')) return
        await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
        fetchItems()
    }

    const handleToggle = async (item: MenuItem) => {
        await fetch(`/api/admin/menu/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, isActive: !item.isActive }),
        })
        fetchItems()
    }

    const filtered = filterCat === 'all' ? items : items.filter(i => i.category === filterCat)

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Menu</h1>
                    <p className="text-white/40 text-sm mt-1">{items.length} item terdaftar</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                    <Plus className="w-4 h-4" /> Tambah Item
                </button>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {[{ value: 'all', label: 'Semua' }, ...categories].map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => setFilterCat(cat.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${filterCat === cat.value ? 'bg-yellow-400 text-black' : 'bg-white/5 text-white/40 hover:text-white border border-white/10'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                    <UtensilsCrossed className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Belum ada item</p>
                </div>
            ) : (
                <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">ITEM</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">KATEGORI</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">HARGA</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">STATUS</th>
                                <th className="text-right px-6 py-4 text-white/30 text-xs font-black tracking-widest">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((item) => (
                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <UtensilsCrossed className="w-4 h-4 text-white/20" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-white font-black text-sm">{item.name}</p>
                                                <p className="text-white/30 text-xs line-clamp-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${catColor[item.category]}`}>
                                            {categories.find(c => c.value === item.category)?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-yellow-400 font-black text-sm">{item.price}</td>
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
                            <h2 className="text-xl font-black text-white">{editing ? 'Edit Item' : 'Tambah Item'}</h2>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <MediaUpload
                                value={form.imageUrl}
                                onChange={(url) => setForm({ ...form, imageUrl: url })}
                                folder="menu"
                                label="Upload Foto Menu"
                            />

                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">NAMA</label>
                                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                    placeholder="Signature Black Curry" />
                            </div>

                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">DESKRIPSI</label>
                                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50 resize-none"
                                    placeholder="Deskripsi menu..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">HARGA</label>
                                    <input
                                        value={priceDisplay}
                                        onChange={handlePriceChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50"
                                        placeholder="Rp 0"
                                        inputMode="numeric"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URUTAN</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">KATEGORI</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50">
                                        {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">SPICE LEVEL</label>
                                    <select value={form.spice} onChange={e => setForm({ ...form, spice: e.target.value })}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50">
                                        {spiceLevels.map(s => <option key={s} value={s}>{s || '— Tidak ada —'}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="accent-yellow-400 w-4 h-4" />
                                <label htmlFor="isActive" className="text-white text-sm font-bold cursor-pointer">Aktif (tampil di website)</label>
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