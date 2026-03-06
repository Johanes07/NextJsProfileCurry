'use client'

import { useEffect } from 'react'

export function ContactMap() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const container = document.getElementById('leaflet-map') as any
    if (container?._leaflet_id) return

    const L = require('leaflet')

    delete (L.Icon.Default.prototype as any)._getIconUrl

    const map = L.map('leaflet-map', {
      center: [-6.8, 107.5],
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const makeIcon = () => L.divIcon({
      html: `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="
            width: 50px;
            height: 50px;
            background: #facc15;
            border-radius: 50%;
            border: 3px solid #000;
            box-shadow: 0 4px 24px rgba(250,204,21,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          ">
            <img
              src="/images/LOGOCURRY1.png"
              style="width: 38px; height: 38px; object-fit: contain;"
            />
          </div>
          <div style="width: 2px; height: 10px; background: #facc15;"></div>
          <div style="
            width: 8px;
            height: 8px;
            background: #facc15;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(250,204,21,0.8);
          "></div>
        </div>
      `,
      className: '',
      iconSize: [50, 72],
      iconAnchor: [25, 72],
      popupAnchor: [0, -76],
    })

    const popupStyle = (title: string, address: string) => `
      <div style="
        background: #111;
        color: #fff;
        border: 1px solid rgba(250,204,21,0.3);
        border-radius: 12px;
        padding: 10px 14px;
        font-family: sans-serif;
        min-width: 200px;
      ">
        <p style="color: #facc15; font-weight: 900; font-size: 13px; margin: 0 0 4px 0;">${title}</p>
        <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 0;">${address}</p>
      </div>
    `

    L.marker([-6.1256, 106.6558], { icon: makeIcon() })
      .addTo(map)
      .bindPopup(popupStyle('100Hours @ CGK T1', 'Bandara Soekarno-Hatta Terminal 1'), { closeButton: false })
      .openPopup()

    L.marker([-6.3003, 106.6531], { icon: makeIcon() })
      .addTo(map)
      .bindPopup(popupStyle('100Hours @ AEON Mall TJB', 'AEON Mall Jakarta Garden City'), { closeButton: false })

  }, [])

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
        .leaflet-container { background: #0a0a0a !important; }
        .leaflet-control-zoom a {
          background: #111 !important;
          color: #facc15 !important;
          border-color: rgba(250,204,21,0.2) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #facc15 !important;
          color: #000 !important;
        }
      `}</style>
      <div
        id="leaflet-map"
        className="h-64 w-full rounded-3xl overflow-hidden border border-yellow-400/10"
        style={{ zIndex: 0 }}
      />
    </>
  )
}