'use client'

import { useEffect, useState, useRef } from 'react'
import { MapPin, Save, RefreshCw, CheckCircle, AlertCircle, Plus, Trash2, Eye, EyeOff } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────
interface MapMarker {
    id: string
    title: string
    address: string
    lat: number
    lng: number
}

interface MapData {
    id?: string
    centerLat: number
    centerLng: number
    zoom: number
    markers: MapMarker[]
}

const DEFAULT_DATA: MapData = {
    centerLat: -6.8,
    centerLng: 107.5,
    zoom: 8,
    markers: [
        { id: '1', title: '100Hours @ CGK T1', address: 'Bandara Soekarno-Hatta Terminal 1', lat: -6.1256, lng: 106.6558 },
        { id: '2', title: '100Hours @ AEON Mall TJB', address: 'AEON Mall Jakarta Garden City', lat: -6.3003, lng: 106.6531 },
    ],
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

// ── Number Field ──────────────────────────────────────────────
function NumField({ label, value, onChange, step = '0.0001' }: {
    label: string; value: number; onChange: (v: number) => void; step?: string
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <input
                type="number" step={step} value={value}
                onChange={e => onChange(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm font-mono
                    focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 transition-all"
            />
        </div>
    )
}

// ── Text Field ────────────────────────────────────────────────
function TextField({ label, value, onChange, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</label>
            <input
                type="text" value={value} placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-2.5 text-white text-sm
                    placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/10 transition-all"
            />
        </div>
    )
}

// ── Live Preview Map ──────────────────────────────────────────
function LiveMapPreview({ data }: { data: MapData }) {
    const mapRef = useRef<any>(null)
    const tileRef = useRef<any>(null)
    const markersRef = useRef<any[]>([])
    const [ready, setReady] = useState(false)

    // Init map
    useEffect(() => {
        if (typeof window === 'undefined') return
        const container = document.getElementById('cms-preview-map') as any
        if (!container || container._leaflet_id) return

        const L = require('leaflet')
        delete (L.Icon.Default.prototype as any)._getIconUrl

        const map = L.map('cms-preview-map', {
            center: [data.centerLat, data.centerLng],
            zoom: data.zoom,
            zoomControl: true,
            scrollWheelZoom: false,
        })
        mapRef.current = map

        tileRef.current = L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            { attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19 }
        ).addTo(map)

        setReady(true)
    }, [])

    // Update markers when data changes
    useEffect(() => {
        if (!ready || !mapRef.current) return
        const L = require('leaflet')

        // Remove old markers
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        const makeIcon = () => L.divIcon({
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;">
                    <div style="width:50px;height:50px;background:#facc15;border-radius:50%;border:3px solid #000;box-shadow:0 4px 24px rgba(250,204,21,0.6);display:flex;align-items:center;justify-content:center;overflow:hidden;">
                        <img src="/images/LOGOCURRY1.png" style="width:38px;height:38px;object-fit:contain;" />
                    </div>
                    <div style="width:2px;height:10px;background:#facc15;"></div>
                    <div style="width:8px;height:8px;background:#facc15;border-radius:50%;box-shadow:0 0 8px rgba(250,204,21,0.8);"></div>
                </div>`,
            className: '',
            iconSize: [50, 72],
            iconAnchor: [25, 72],
            popupAnchor: [0, -76],
        })

        data.markers.forEach(m => {
            if (!m.lat || !m.lng) return
            const marker = L.marker([m.lat, m.lng], { icon: makeIcon() })
                .addTo(mapRef.current)
                .bindPopup(`<div style="background:#111;color:#fff;border:1px solid rgba(250,204,21,0.3);border-radius:10px;padding:8px 12px;font-family:sans-serif;min-width:160px;">
                    <p style="color:#eab308;font-weight:900;font-size:12px;margin:0 0 3px 0;">${m.title || 'Untitled'}</p>
                    <p style="color:rgba(255,255,255,0.5);font-size:10px;margin:0;">${m.address || ''}</p>
                </div>`, { closeButton: false })
            markersRef.current.push(marker)
        })

        // Re-center
        mapRef.current.setView([data.centerLat, data.centerLng], data.zoom)
    }, [ready, data])

    return (
        <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <style>{`
                .leaflet-popup-content-wrapper, .leaflet-popup-content { background:transparent!important;box-shadow:none!important;padding:0!important;margin:0!important; }
                .leaflet-popup-tip-container { display:none; }
                .leaflet-container { background:#0a0a0a!important; }
                .leaflet-control-zoom a { background:#111!important;color:#eab308!important;border-color:rgba(234,179,8,0.2)!important; }
                .leaflet-control-zoom a:hover { background:#facc15!important;color:#000!important; }
            `}</style>
            <div id="cms-preview-map" className="h-64 w-full rounded-2xl overflow-hidden border border-yellow-400/10" style={{ zIndex: 0 }} />
        </>
    )
}

// ── Marker Card ───────────────────────────────────────────────
function MarkerCard({ marker, index, onChange, onDelete }: {
    marker: MapMarker
    index: number
    onChange: (m: MapMarker) => void
    onDelete: () => void
}) {
    const [open, setOpen] = useState(true)

    return (
        <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 cursor-pointer" onClick={() => setOpen(p => !p)}>
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-yellow-400/10 border border-yellow-400/20 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{marker.title || `Marker ${index + 1}`}</p>
                        <p className="text-xs text-zinc-500 font-mono">{marker.lat}, {marker.lng}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); onDelete() }}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-zinc-700/40 pt-4">
                    <TextField label="Title" value={marker.title} onChange={v => onChange({ ...marker, title: v })}
                        placeholder="100Hours @ Location" />
                    <TextField label="Address" value={marker.address} onChange={v => onChange({ ...marker, address: v })}
                        placeholder="Jl. Contoh No. 1, Jakarta" />
                    <div className="grid grid-cols-2 gap-3">
                        <NumField label="Latitude" value={marker.lat} onChange={v => onChange({ ...marker, lat: v })} />
                        <NumField label="Longitude" value={marker.lng} onChange={v => onChange({ ...marker, lng: v })} />
                    </div>
                    <div className="bg-zinc-900/60 rounded-xl p-3">
                        <p className="text-xs text-zinc-500 mb-1">💡 Cara cari koordinat:</p>
                        <p className="text-xs text-zinc-600">Buka <span className="text-yellow-400">Google Maps</span> → klik lokasi → copy angka di URL atau klik kanan → "What's here?"</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Main CMS ──────────────────────────────────────────────────
export default function ContactMapCMS() {
    const [data, setData] = useState<MapData>(DEFAULT_DATA)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
    const [isDirty, setIsDirty] = useState(false)
    const originalRef = useRef<MapData>(DEFAULT_DATA)

    useEffect(() => {
        fetch('/api/admin/contact/map')
            .then(r => r.json())
            .then(d => { setData(d); originalRef.current = d })
            .catch(() => showToast('Gagal memuat data', 'error'))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        setIsDirty(JSON.stringify(data) !== JSON.stringify(originalRef.current))
    }, [data])

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3000)
    }

    function handleReset() { setData(originalRef.current); setIsDirty(false) }

    function addMarker() {
        setData(prev => ({
            ...prev,
            markers: [...prev.markers, {
                id: Date.now().toString(),
                title: '', address: '', lat: prev.centerLat, lng: prev.centerLng
            }]
        }))
    }

    function updateMarker(index: number, marker: MapMarker) {
        setData(prev => {
            const markers = [...prev.markers]
            markers[index] = marker
            return { ...prev, markers }
        })
    }

    function deleteMarker(index: number) {
        setData(prev => ({ ...prev, markers: prev.markers.filter((_, i) => i !== index) }))
    }

    async function handleSave() {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/contact/map', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setData(updated); originalRef.current = updated
            setIsDirty(false)
            showToast('Peta berhasil disimpan!', 'success')
        } catch {
            showToast('Gagal menyimpan', 'error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
                    <p className="text-zinc-500 text-sm">Memuat data peta...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-white">Contact Map</h1>
                            <p className="text-xs text-zinc-500">Edit lokasi & marker peta di halaman contact</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isDirty && (
                            <span className="hidden sm:flex items-center gap-1.5 text-xs text-yellow-400/80 bg-yellow-400/5 border border-yellow-400/20 rounded-full px-3 py-1.5">
                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                                Ada perubahan
                            </span>
                        )}
                        <button onClick={handleReset} disabled={!isDirty}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium
                                hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <RefreshCw className="w-3.5 h-3.5" /> Reset
                        </button>
                        <button onClick={handleSave} disabled={saving || !isDirty}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-yellow-400 text-black text-sm font-black
                                hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-400/20">
                            {saving
                                ? <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                : <Save className="w-3.5 h-3.5" />}
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">

                    {/* Form Panel */}
                    <div className="space-y-6">

                        {/* Map Center */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <h2 className="text-sm font-bold text-zinc-300 mb-5 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                Posisi Tengah Peta
                            </h2>
                            <div className="grid grid-cols-3 gap-4">
                                <NumField label="Center Latitude" value={data.centerLat}
                                    onChange={v => setData(p => ({ ...p, centerLat: v }))} />
                                <NumField label="Center Longitude" value={data.centerLng}
                                    onChange={v => setData(p => ({ ...p, centerLng: v }))} />
                                <NumField label="Zoom Level" value={data.zoom} step="1"
                                    onChange={v => setData(p => ({ ...p, zoom: Math.min(18, Math.max(1, v)) }))} />
                            </div>
                            <p className="text-xs text-zinc-600 mt-3">Zoom: 1 = dunia, 8 = provinsi, 13 = kota, 17 = jalan</p>
                        </div>

                        {/* Markers */}
                        <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-yellow-400 rounded-full inline-block" />
                                    Marker Lokasi
                                    <span className="ml-1 px-2 py-0.5 bg-zinc-800 rounded-full text-xs text-zinc-500">
                                        {data.markers.length}
                                    </span>
                                </h2>
                                <button onClick={addMarker}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-xs font-bold hover:bg-yellow-400/20 transition-all">
                                    <Plus className="w-3.5 h-3.5" /> Tambah Marker
                                </button>
                            </div>

                            {data.markers.length === 0 ? (
                                <div className="text-center py-10">
                                    <MapPin className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                                    <p className="text-zinc-600 text-sm">Belum ada marker. Klik "Tambah Marker".</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {data.markers.map((marker, i) => (
                                        <MarkerCard key={marker.id} marker={marker} index={i}
                                            onChange={m => updateMarker(i, m)}
                                            onDelete={() => deleteMarker(i)} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="space-y-4">
                        <div className="sticky top-24">
                            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Live Preview</h2>
                            <div className="rounded-2xl overflow-hidden border border-zinc-800/60 shadow-2xl shadow-black/50">
                                <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-2.5 flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                    </div>
                                    <span className="text-xs text-zinc-600 ml-2 font-mono">yoursite.com/contact</span>
                                </div>
                                <div className="p-4">
                                    <LiveMapPreview data={data} />
                                </div>
                            </div>

                            <div className="mt-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                                <p className="text-xs font-bold text-yellow-400 mb-2">💡 Tips koordinat</p>
                                <ul className="text-xs text-zinc-500 space-y-1">
                                    <li>• Buka Google Maps, klik lokasi yang diinginkan</li>
                                    <li>• Kanan klik → pilih "What's here?"</li>
                                    <li>• Copy angka: <span className="text-zinc-400 font-mono">-6.1234, 106.5678</span></li>
                                    <li>• Angka pertama = Latitude, kedua = Longitude</li>
                                </ul>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
                                    <p className="text-xs text-zinc-500 mb-1">Total Marker</p>
                                    <p className="text-2xl font-black text-white">{data.markers.length}</p>
                                </div>
                                <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4">
                                    <p className="text-xs text-zinc-500 mb-1">Zoom Level</p>
                                    <p className="text-2xl font-black text-white">{data.zoom}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    )
}