'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2, VolumeX, ArrowRight, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTheme } from 'next-themes'

type Promo = {
    id: string; type: 'image' | 'video'; src: string; tag: string; title: string
    desc: string; cta: string; ctaLink: string; badge: string; isActive: boolean; order: number
}

export function FeaturedPrograms() {
    const [promos, setPromos] = useState<Promo[]>([])
    const [loadingData, setLoadingData] = useState(true)
    const [activeIndex, setActiveIndex] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(true)
    const [progress, setProgress] = useState(0)
    const [mounted, setMounted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const progressRef = useRef<NodeJS.Timeout | null>(null)
    const DURATION = 10000
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
        fetch('/api/website/promo')
            .then(res => res.json())
            .then(data => { setPromos(Array.isArray(data) ? data : []); setLoadingData(false) })
            .catch(() => setLoadingData(false))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true
    const current = promos[activeIndex]

    const goTo = useCallback((index: number) => {
        setActiveIndex(index); setProgress(0)
        setPlaying(promos[index]?.type === 'video')
        if (timerRef.current) clearTimeout(timerRef.current)
        if (progressRef.current) clearInterval(progressRef.current)
    }, [promos])

    const goNext = useCallback(() => {
        if (promos.length === 0) return
        goTo((activeIndex + 1) % promos.length)
    }, [activeIndex, goTo, promos.length])

    const goPrev = useCallback(() => {
        if (promos.length === 0) return
        goTo((activeIndex - 1 + promos.length) % promos.length)
    }, [activeIndex, goTo, promos.length])

    useEffect(() => {
        if (!current || current.type !== 'image') return
        setProgress(0)
        if (progressRef.current) clearInterval(progressRef.current)
        progressRef.current = setInterval(() => {
            setProgress(p => p >= 100 ? 100 : p + (100 / (DURATION / 100)))
        }, 100)
        timerRef.current = setTimeout(() => goNext(), DURATION)
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            if (progressRef.current) clearInterval(progressRef.current)
        }
    }, [activeIndex, current, goNext])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const handleEnded = () => goNext()
        video.addEventListener('ended', handleEnded)
        return () => video.removeEventListener('ended', handleEnded)
    }, [activeIndex, goNext])

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!videoRef.current) return
        if (playing) { videoRef.current.pause() } else { videoRef.current.play() }
        setPlaying(!playing)
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!videoRef.current) return
        videoRef.current.muted = !muted
        setMuted(!muted)
    }

    if (loadingData) return (
        <section className={`py-12 md:py-24 flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`} style={{ minHeight: '400px' }}>
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </section>
    )
    if (promos.length === 0) return null

    return (
        <section className={`py-12 md:py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">Promo & Updates</span>
                        <h2 className={`text-3xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {"WHAT'S"}<span className="block text-yellow-500">HOT NOW</span>
                        </h2>
                    </div>
                    <p className={`max-w-xs text-sm hidden md:block ${isDark ? 'text-white/30' : 'text-gray-400'}`}>Tap any card to explore. New promos every week.</p>
                </div>

                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden" style={{ height: 'clamp(420px, 60vw, 560px)' }}>
                    {current.type === 'video' ? (
                        <div className="absolute inset-0">
                            <video key={current.src} ref={videoRef} src={current.src} loop={false} muted={muted} playsInline autoPlay
                                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                                className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <Image key={current.src} src={current.src} alt={current.title} fill className="object-cover" priority />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute inset-0 flex items-end p-5 md:p-10 z-10">
                        <div className="w-full md:max-w-xl">
                            <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full mb-3 inline-block">{current.badge}</span>
                            <p className="text-yellow-400 text-xs font-black tracking-widest mb-2 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {current.tag.toUpperCase()}
                            </p>
                            <h3 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 leading-tight">{current.title}</h3>
                            <p className="text-white/50 text-sm md:text-base leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">{current.desc}</p>
                            <a href={current.ctaLink} className="inline-flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-black text-sm hover:scale-105 transition-all">
                                {current.cta} <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {current.type === 'video' && (
                        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 z-20">
                            <button onClick={toggleMute} className="w-8 h-8 md:w-9 md:h-9 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={togglePlay} className="w-8 h-8 md:w-9 md:h-9 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                                {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                            </button>
                        </div>
                    )}

                    <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <div className="absolute bottom-3 left-5 right-5 md:bottom-4 md:left-10 md:right-10 z-20 flex gap-2">
                        {promos.map((p, i) => (
                            <button key={i} onClick={() => goTo(i)} className="flex-1 h-1 rounded-full overflow-hidden bg-white/20">
                                <div className="h-full bg-yellow-400 rounded-full transition-none"
                                    style={{ width: i < activeIndex ? '100%' : i === activeIndex && p.type === 'image' ? `${progress}%` : '0%' }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}