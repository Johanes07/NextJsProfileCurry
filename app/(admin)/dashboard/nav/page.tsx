'use client'

import { useState, useEffect, Fragment } from 'react'
import { Plus, Trash2, Edit2, Save, X, ChevronDown, ChevronRight, Loader2, Navigation } from 'lucide-react'

const ICONS = [
    'LayoutDashboard', 'UtensilsCrossed', 'Megaphone', 'Instagram', 'Briefcase',
    'MessageSquare', 'Settings', 'Users', 'BookOpen', 'Home', 'Star', 'Heart',
    'Bell', 'Calendar', 'Chart', 'File', 'Folder', 'Globe', 'Image', 'Link',
    'Lock', 'Mail', 'Map', 'Package', 'Phone', 'Search', 'Shield', 'Tag',
    'TrendingUp', 'Truck', 'User', 'Zap', 'BarChart', 'Camera', 'Coffee',
]

type NavChild = {
    id: string
    label: string
    icon: string
    href: string
    order: number
    isActive: boolean
}

type NavItem = {
    id: string
    label: string
    icon: string
    href: string | null
    groupName: string | null
    order: number
    isActive: boolean
    children: NavChild[]
}

const emptyItem = { label: '', icon: 'LayoutDashboard', href: '', groupName: '', isGroup: false }
const emptyChild = { label: '', icon: 'Home', href: '' }

export default function NavCMSPage() {
    const [items, setItems] = useState<NavItem[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string[]>([])
    const [editItem, setEditItem] = useState<NavItem | null>(null)
    const [editChild, setEditChild] = useState<{ parentId: string; child: NavChild } | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showAddChild, setShowAddChild] = useState<string | null>(null)
    const [newItem, setNewItem] = useState(emptyItem)
    const [newChild, setNewChild] = useState(emptyChild)
    const [saving, setSaving] = useState(false)

    const load = () => {
        fetch('/api/admin/nav')
            .then(r => r.json())
            .then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const toggleExpand = (id: string) =>
        setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

    const handleAddItem = async () => {
        if (!newItem.label) return
        setSaving(true)
        await fetch('/api/admin/nav', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                label: newItem.label,
                icon: newItem.icon,
                href: newItem.isGroup ? null : (newItem.href || null),
                groupName: newItem.isGroup ? newItem.groupName : null,
                order: items.length,
            })
        })
        setNewItem(emptyItem)
        setShowAddModal(false)
        setSaving(false)
        load()
    }

    const handleAddChild = async (parentId: string) => {
        if (!newChild.label || !newChild.href) return
        setSaving(true)
        await fetch(`/api/admin/nav/${parentId}/children`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newChild, order: 0 })
        })
        setNewChild(emptyChild)
        setShowAddChild(null)
        setSaving(false)
        load()
    }

    const handleUpdateItem = async () => {
        if (!editItem) return
        setSaving(true)
        await fetch(`/api/admin/nav/${editItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editItem)
        })
        setEditItem(null)
        setSaving(false)
        load()
    }

    const handleUpdateChild = async () => {
        if (!editChild) return
        setSaving(true)
        await fetch(`/api/admin/nav/children/${editChild.child.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editChild.child)
        })
        setEditChild(null)
        setSaving(false)
        load()
    }

    const handleDeleteItem = async (id: string) => {
        if (!confirm('Hapus item ini beserta semua sub-menu-nya?')) return
        await fetch(`/api/admin/nav/${id}`, { method: 'DELETE' })
        load()
    }

    const handleDeleteChild = async (id: string) => {
        if (!confirm('Hapus sub-menu ini?')) return
        await fetch(`/api/admin/nav/children/${id}`, { method: 'DELETE' })
        load()
    }

    const toggleItemActive = async (item: NavItem) => {
        await fetch(`/api/admin/nav/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, isActive: !item.isActive })
        })
        load()
    }

    const IconSelect = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <select value={value} onChange={e => onChange(e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50">
            {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
        </select>
    )

    const TypeBadge = ({ item }: { item: NavItem }) => {
        if (item.groupName) return <span className="text-xs font-bold px-2 py-1 rounded-lg bg-purple-400/10 text-purple-400">Group Header</span>
        if (item.children.length > 0) return <span className="text-xs font-bold px-2 py-1 rounded-lg bg-blue-400/10 text-blue-400">Parent Menu</span>
        return <span className="text-xs font-bold px-2 py-1 rounded-lg bg-yellow-400/10 text-yellow-400">Menu Item</span>
    }

    const HrefDisplay = ({ item }: { item: NavItem }) => {
        if (item.groupName) return <span className="text-white/20 text-xs italic">— section label only —</span>
        if (!item.href) return <span className="text-white/20 text-xs italic">— no link —</span>
        return <span className="text-white/40 text-xs font-mono">{item.href}</span>
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
    )

    return (
        <div className="p-8 bg-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white">Sidebar Admin</h1>
                    <p className="text-white/40 text-sm mt-1">{items.length} menu terdaftar</p>
                </div>
                <button onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                    <Plus className="w-4 h-4" /> Tambah Menu
                </button>
            </div>

            {/* Table */}
            {items.length === 0 ? (
                <div className="text-center py-20 text-white/20">
                    <Navigation className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Belum ada menu. Klik &quot;Tambah Menu&quot; untuk mulai.</p>
                </div>
            ) : (
                <div className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">MENU</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">TIPE</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">URL / INFO</th>
                                <th className="text-left px-6 py-4 text-white/30 text-xs font-black tracking-widest">STATUS</th>
                                <th className="text-right px-6 py-4 text-white/30 text-xs font-black tracking-widest">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <Fragment key={item.id}>
                                    {/* Parent row */}
                                    <tr className={`border-b border-white/5 hover:bg-white/2 transition-colors ${!item.isActive ? 'opacity-40' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-yellow-400/10 rounded-xl flex items-center justify-center shrink-0">
                                                    <span className="text-yellow-400 text-xs font-black">{item.icon.slice(0, 2)}</span>
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-sm">{item.label}</p>
                                                    <p className="text-white/30 text-xs">icon: {item.icon}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><TypeBadge item={item} /></td>
                                        <td className="px-6 py-4"><HrefDisplay item={item} /></td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleItemActive(item)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${item.isActive ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}>
                                                {item.isActive ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 justify-end">
                                                <button onClick={() => toggleExpand(item.id)}
                                                    className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                                    <div className="flex items-center gap-1">
                                                        {item.children.length > 0 && (
                                                            <span className="text-[10px] font-black text-yellow-400">{item.children.length}</span>
                                                        )}
                                                        {expanded.includes(item.id) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                    </div>
                                                </button>
                                                <button onClick={() => setEditItem(item)}
                                                    className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-yellow-400/10 hover:text-yellow-400 text-white/40 transition-all">
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => handleDeleteItem(item.id)}
                                                    className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-400/10 hover:text-red-400 text-white/40 transition-all">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Children rows */}
                                    {expanded.includes(item.id) && (
                                        <Fragment>
                                            {item.children.map(child => (
                                                <tr key={child.id} className="border-b border-white/3 bg-white/1 hover:bg-white/3 transition-colors">
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-3 pl-8">
                                                            <div className="w-1.5 h-1.5 bg-yellow-400/40 rounded-full shrink-0" />
                                                            <div>
                                                                <p className="text-white/80 font-bold text-sm">{child.label}</p>
                                                                <p className="text-white/20 text-xs">icon: {child.icon}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white/5 text-white/30">Sub-Menu</span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="text-white/40 text-xs font-mono">
                                                            {child.href || <span className="text-white/20 italic">— no link —</span>}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${child.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
                                                            {child.isActive ? 'Aktif' : 'Nonaktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setEditChild({ parentId: item.id, child })}
                                                                className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-yellow-400/10 hover:text-yellow-400 text-white/40 transition-all">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteChild(child.id)}
                                                                className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-400/10 hover:text-red-400 text-white/40 transition-all">
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* Add child row */}
                                            {showAddChild === item.id ? (
                                                <tr className="border-b border-white/5 bg-yellow-400/3">
                                                    <td colSpan={5} className="px-6 py-3">
                                                        <div className="pl-8 flex items-center gap-3">
                                                            <input value={newChild.label} onChange={e => setNewChild(p => ({ ...p, label: e.target.value }))}
                                                                placeholder="Label sub-menu"
                                                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400/50 w-40" />
                                                            <select value={newChild.icon} onChange={e => setNewChild(p => ({ ...p, icon: e.target.value }))}
                                                                className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400/50 w-36">
                                                                {ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                                            </select>
                                                            <input value={newChild.href} onChange={e => setNewChild(p => ({ ...p, href: e.target.value }))}
                                                                placeholder="/dashboard/contoh"
                                                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-yellow-400/50 flex-1" />
                                                            <button onClick={() => handleAddChild(item.id)} disabled={saving}
                                                                className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-2 rounded-xl font-black text-xs shrink-0">
                                                                <Save className="w-3 h-3" /> Simpan
                                                            </button>
                                                            <button onClick={() => setShowAddChild(null)}
                                                                className="flex items-center gap-1 bg-white/10 text-white px-3 py-2 rounded-xl text-xs shrink-0">
                                                                <X className="w-3 h-3" /> Batal
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr className="border-b border-white/5">
                                                    <td colSpan={5}>
                                                        <button onClick={() => setShowAddChild(item.id)}
                                                            className="w-full flex items-center gap-2 px-6 py-2.5 pl-16 text-white/20 hover:text-yellow-400 hover:bg-white/2 transition-all text-xs font-bold">
                                                            <Plus className="w-3 h-3" /> Tambah Sub-Menu
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Tambah Menu */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">Tambah Menu</h2>
                            <button onClick={() => setShowAddModal(false)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                <input type="checkbox" id="isGroup" checked={newItem.isGroup}
                                    onChange={e => setNewItem(p => ({ ...p, isGroup: e.target.checked }))}
                                    className="accent-yellow-400 w-4 h-4" />
                                <label htmlFor="isGroup" className="text-white text-sm font-bold cursor-pointer">
                                    Ini adalah Group Header <span className="text-white/30 font-normal">(label seksi tanpa link)</span>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">LABEL</label>
                                    <input value={newItem.label} onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
                                        placeholder="contoh: Dashboard"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">ICON</label>
                                    <IconSelect value={newItem.icon} onChange={v => setNewItem(p => ({ ...p, icon: v }))} />
                                </div>
                            </div>
                            {!newItem.isGroup && (
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URL / HREF</label>
                                    <input value={newItem.href} onChange={e => setNewItem(p => ({ ...p, href: e.target.value }))}
                                        placeholder="contoh: /dashboard/menu"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                    <p className="text-white/20 text-xs mt-1">Kosongkan jika menu ini punya sub-menu (parent menu)</p>
                                </div>
                            )}
                            {newItem.isGroup && (
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">NAMA GROUP</label>
                                    <input value={newItem.groupName} onChange={e => setNewItem(p => ({ ...p, groupName: e.target.value }))}
                                        placeholder="contoh: Website, Konten, dll."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                    <p className="text-white/20 text-xs mt-1">Tampil sebagai label seksi di sidebar, tidak bisa diklik</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <button onClick={() => setShowAddModal(false)}
                                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl font-black hover:bg-white/10 transition-all">
                                Batal
                            </button>
                            <button onClick={handleAddItem} disabled={saving}
                                className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Item */}
            {editItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">Edit Menu</h2>
                            <button onClick={() => setEditItem(null)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">LABEL</label>
                                    <input value={editItem.label} onChange={e => setEditItem(p => p ? { ...p, label: e.target.value } : null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">ICON</label>
                                    <IconSelect value={editItem.icon} onChange={v => setEditItem(p => p ? { ...p, icon: v } : null)} />
                                </div>
                            </div>
                            {!editItem.groupName && (
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URL / HREF</label>
                                    <input value={editItem.href || ''} onChange={e => setEditItem(p => p ? { ...p, href: e.target.value } : null)}
                                        placeholder="/dashboard/..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                    <p className="text-white/20 text-xs mt-1">Kosongkan jika menu ini punya sub-menu</p>
                                </div>
                            )}
                            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                                <input type="checkbox" id="editActive" checked={editItem.isActive}
                                    onChange={e => setEditItem(p => p ? { ...p, isActive: e.target.checked } : null)}
                                    className="accent-yellow-400 w-4 h-4" />
                                <label htmlFor="editActive" className="text-white text-sm font-bold cursor-pointer">Aktif (tampil di sidebar)</label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <button onClick={() => setEditItem(null)}
                                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl font-black hover:bg-white/10 transition-all">
                                Batal
                            </button>
                            <button onClick={handleUpdateItem} disabled={saving}
                                className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edit Child */}
            {editChild && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-black text-white">Edit Sub-Menu</h2>
                            <button onClick={() => setEditChild(null)} className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">LABEL</label>
                                    <input value={editChild.child.label}
                                        onChange={e => setEditChild(p => p ? { ...p, child: { ...p.child, label: e.target.value } } : null)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-black tracking-widest block mb-2">ICON</label>
                                    <IconSelect value={editChild.child.icon} onChange={v => setEditChild(p => p ? { ...p, child: { ...p.child, icon: v } } : null)} />
                                </div>
                            </div>
                            <div>
                                <label className="text-white/40 text-xs font-black tracking-widest block mb-2">URL / HREF</label>
                                <input value={editChild.child.href}
                                    onChange={e => setEditChild(p => p ? { ...p, child: { ...p.child, href: e.target.value } } : null)}
                                    placeholder="/dashboard/..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400/50" />
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <button onClick={() => setEditChild(null)}
                                className="flex-1 bg-white/5 border border-white/10 text-white/60 py-3 rounded-xl font-black hover:bg-white/10 transition-all">
                                Batal
                            </button>
                            <button onClick={handleUpdateChild} disabled={saving}
                                className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
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