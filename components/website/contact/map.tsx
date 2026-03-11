'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MapMarker {
  id: string
  title: string
  address: string
  lat: number
  lng: number
}

interface MapData {
  centerLat: number
  centerLng: number
  zoom: number
  markers: MapMarker[]
}

const DEFAULT: MapData = {
  centerLat: -6.8,
  centerLng: 107.5,
  zoom: 8,
  markers: [
    { id: '1', title: '100Hours @ CGK T1', address: 'Bandara Soekarno-Hatta Terminal 1', lat: -6.1256, lng: 106.6558 },
    { id: '2', title: '100Hours @ AEON Mall TJB', address: 'AEON Mall Jakarta Garden City', lat: -6.3003, lng: 106.6531 },
  ],
}

export function ContactMap() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mapData, setMapData] = useState<MapData>(DEFAULT)
  const mapRef = useRef<any>(null)
  const tileRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch('/api/admin/contact/map', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: Partial<MapData>) => {
        setMapData({
          centerLat: d.centerLat ?? DEFAULT.centerLat,
          centerLng: d.centerLng ?? DEFAULT.centerLng,
          zoom: d.zoom ?? DEFAULT.zoom,
          markers: Array.isArray(d.markers) && d.markers.length > 0 ? d.markers : DEFAULT.markers,
        })
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (typeof window === 'undefined') return

    const container = document.getElementById('leaflet-map') as any
    if (!container) return

    const isDark = resolvedTheme === 'dark'
    const L = require('leaflet')
    delete (L.Icon.Default.prototype as any)._getIconUrl

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

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

    const popupStyle = (title: string, address: string) => `
            <div style="background:${isDark ? '#111' : '#fff'};color:${isDark ? '#fff' : '#111'};border:1px solid rgba(250,204,21,0.3);border-radius:12px;padding:10px 14px;font-family:sans-serif;min-width:200px;">
                <p style="color:#eab308;font-weight:900;font-size:13px;margin:0 0 4px 0;">${title}</p>
                <p style="color:${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};font-size:11px;margin:0;">${address}</p>
            </div>`

    // ── If map already exists, swap tile + re-render markers ──
    if (container._leaflet_id && mapRef.current) {
      if (tileRef.current) mapRef.current.removeLayer(tileRef.current)
      tileRef.current = L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapRef.current)

      // Remove old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      // Add updated markers
      mapData.markers.forEach((m, i) => {
        const marker = L.marker([m.lat, m.lng], { icon: makeIcon() })
          .addTo(mapRef.current)
          .bindPopup(popupStyle(m.title, m.address), { closeButton: false })
        if (i === 0) marker.openPopup()
        markersRef.current.push(marker)
      })

      mapRef.current.setView([mapData.centerLat, mapData.centerLng], mapData.zoom)
      return
    }

    // ── First init ────────────────────────────────────────────
    const map = L.map('leaflet-map', {
      center: [mapData.centerLat, mapData.centerLng],
      zoom: mapData.zoom,
      zoomControl: true,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    tileRef.current = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    mapData.markers.forEach((m, i) => {
      const marker = L.marker([m.lat, m.lng], { icon: makeIcon() })
        .addTo(map)
        .bindPopup(popupStyle(m.title, m.address), { closeButton: false })
      if (i === 0) marker.openPopup()
      markersRef.current.push(marker)
    })

  }, [mounted, resolvedTheme, mapData])

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
                .leaflet-popup-content-wrapper,
                .leaflet-popup-content {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                .leaflet-popup-tip-container { display: none; }
                .leaflet-container { background: ${isDark ? '#0a0a0a' : '#f5f5f0'} !important; }
                .leaflet-control-zoom a {
                    background: ${isDark ? '#111' : '#fff'} !important;
                    color: #eab308 !important;
                    border-color: rgba(234,179,8,0.2) !important;
                }
                .leaflet-control-zoom a:hover {
                    background: #facc15 !important;
                    color: #000 !important;
                }
            `}</style>
      <div
        id="leaflet-map"
        className={`h-64 w-full rounded-3xl overflow-hidden border transition-colors ${isDark ? 'border-yellow-400/10' : 'border-yellow-400/20'}`}
        style={{ zIndex: 0 }}
      />
    </>
  )
}