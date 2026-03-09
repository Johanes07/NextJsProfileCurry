'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Flame, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useTheme } from 'next-themes'

const categories = [
    { id: 'maindish', label: 'Main Dish' },
    { id: 'sidedish', label: 'Side Dish' },
    { id: 'hot', label: 'Hot Drinks' },
    { id: 'iced', label: 'Iced Drinks' },
]

type MenuItem = {
    id: string; name: string; desc: string; price: string; category: string
    spice: string | null; imageUrl: string | null; isActive: boolean; order: number
}

const spiceColor: Record<string, string> = {
    'Mild': 'text-green-500 border-green-400/40',
    'Medium': 'text-orange-500 border-orange-400/40',
    'Hot': 'text-red-500 border-red-400/40',
    'Extra Hot': 'text-red-600 border-red-500/40',
}

export function MenuGrid() {
    const [activeCategory, setActiveCategory] = useState('maindish')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [direction, setDirection] = useState<'left' | 'right'>('right')
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)
    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)
    const { resolvedTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
        fetch('/api/website/menu')
            .then(res => res.json())
            .then(data => { setMenuItems(Array.isArray(data) ? data : []); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const isDark = mounted ? resolvedTheme === 'dark' : true

    const filtered = menuItems.filter(i => i.category === activeCategory && i.isActive)
    const current = filtered[currentIndex]
    const prev = filtered[(currentIndex - 1 + filtered.length) % filtered.length]
    const next = filtered[(currentIndex + 1) % filtered.length]

    const navigate = useCallback((dir: 'left' | 'right') => {
        if (animating || filtered.length <= 1) return
        setDirection(dir)
        setAnimating(true)
        setTimeout(() => {
            setCurrentIndex(idx => dir === 'right' ? (idx + 1) % filtered.length : (idx - 1 + filtered.length) % filtered.length)
            setAnimating(false)
        }, 350)
    }, [animating, filtered.length])

    useEffect(() => { setCurrentIndex(0) }, [activeCategory])

    useEffect(() => {
        if (filtered.length <= 1) return
        const timer = setInterval(() => navigate('right'), 4000)
        return () => clearInterval(timer)
    }, [navigate, filtered.length])

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return
        const deltaX = e.changedTouches[0].clientX - touchStartX.current
        const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) navigate(deltaX < 0 ? 'right' : 'left')
        touchStartX.current = null; touchStartY.current = null
    }

    const infoStyle = {
        opacity: animating ? 0 : 1,
        transform: animating ? `translateX(${direction === 'right' ? '-30px' : '30px'})` : 'translateX(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
    }
    const imgStyle = {
        opacity: animating ? 0 : 1,
        transform: animating ? `scale(0.96) translateX(${direction === 'right' ? '30px' : '-30px'})` : 'scale(1) translateX(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
    }
    const peekStyle = { opacity: animating ? 0 : 0.25, transition: 'opacity 0.35s ease' }

    // Theme-aware classes
    const sectionBg = isDark ? 'bg-black' : 'bg-amber-50'
    const tabsBg = isDark ? 'bg-black/90 border-white/5' : 'bg-white/90 border-gray-200'
    const tabActive = isDark ? 'text-yellow-400' : 'text-yellow-600'
    const tabInactive = isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-700'
    const tabIndicator = isDark ? 'bg-yellow-400' : 'bg-yellow-500'
    const navBtn = isDark
        ? 'bg-white/5 border-white/10 text-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black'
        : 'bg-white border-gray-200 text-gray-600 hover:bg-yellow-400 hover:border-yellow-400 hover:text-black shadow-sm'
    const counterMain = isDark ? 'text-yellow-400' : 'text-yellow-600'
    const counterSub = isDark ? 'text-white/20' : 'text-gray-300'
    const titleColor = isDark ? 'text-white' : 'text-gray-900'
    const descColor = isDark ? 'text-white/40' : 'text-gray-500'
    const priceLabel = isDark ? 'text-white/20' : 'text-gray-400'
    const priceColor = isDark ? 'text-yellow-400' : 'text-yellow-600'
    const cardBadgeBg = isDark ? 'bg-black/50 border-white/10' : 'bg-white/80 border-gray-200'
    const cardBadgeText = isDark ? 'text-white/40' : 'text-gray-400'
    const cardBadgeMain = isDark ? 'text-white' : 'text-gray-900'
    const dotInactive = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'
    const emptyText = isDark ? 'text-white/20' : 'text-gray-300'

    const DotsIndicator = ({ count, active }: { count: number; active: number }) => {
        if (count <= 1) return null
        if (count <= 7) {
            return (
                <div className="flex gap-1.5 items-center">
                    {Array.from({ length: count }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentIndex(i)}
                            className="rounded-full transition-all duration-300"
                            style={{ width: i === active ? '1.5rem' : '0.375rem', height: '0.375rem', backgroundColor: i === active ? (isDark ? '#facc15' : '#eab308') : dotInactive }} />
                    ))}
                </div>
            )
        }
        return (
            <div className="flex items-center gap-2">
                <div className={`h-0.5 w-8 rounded-full ${isDark ? 'bg-yellow-400' : 'bg-yellow-500'}`} />
                <span className={`text-xs font-bold ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{active + 1} / {count}</span>
            </div>
        )
    }

    const CategoryTabs = () => (
        <div className={`border-b sticky top-16 z-30 backdrop-blur-md ${tabsBg}`}>
            <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
                {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                        className={`relative px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm font-black tracking-widest whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? tabActive : tabInactive}`}>
                        {cat.label.toUpperCase()}
                        {activeCategory === cat.id && <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${tabIndicator}`} />}
                    </button>
                ))}
            </div>
        </div>
    )

    if (loading) return (
        <section className={`${sectionBg} min-h-screen flex items-center justify-center`}>
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </section>
    )

    if (!current) return (
        <section className={`${sectionBg} min-h-screen`}>
            <CategoryTabs />
            <div className={`flex items-center justify-center h-[60vh] font-bold ${emptyText}`}>Belum ada menu di kategori ini</div>
        </section>
    )

    return (
        <section className={`${sectionBg} min-h-screen transition-colors duration-300`}>
            <CategoryTabs />

            <div className="relative overflow-hidden">
                {/* Blurred BG */}
                <div className="absolute inset-0">
                    {current.imageUrl && (
                        <Image src={current.imageUrl} alt="" fill className="object-cover blur-3xl opacity-15 scale-110" priority />
                    )}
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black/80 via-black/60 to-black' : 'bg-gradient-to-b from-amber-50/80 via-amber-50/60 to-amber-50'}`} />
                </div>

                {/* ── MOBILE ── */}
                <div className="relative z-10 md:hidden flex flex-col min-h-[90vh] px-5 pt-8 pb-6"
                    onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div key={current.id + 'img-m'} className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/30 mb-6" style={imgStyle}>
                        {current.imageUrl
                            ? <Image src={current.imageUrl} alt={current.name} fill className="object-cover" priority />
                            : <div className={`w-full h-full flex items-center justify-center font-bold ${isDark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-300'}`}>No Image</div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className={`absolute bottom-3 left-3 backdrop-blur-sm border rounded-xl px-3 py-1.5 ${cardBadgeBg}`}>
                            <p className={`text-xs ${cardBadgeText}`}>crafted for</p>
                            <p className={`font-black text-sm ${cardBadgeMain}`}>100 Hours</p>
                        </div>
                    </div>

                    <div key={current.id + 'info-m'} style={infoStyle} className="flex-1">
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className={`font-black text-4xl leading-none ${counterMain}`}>{String(currentIndex + 1).padStart(2, '0')}</span>
                            <span className={`font-bold text-lg ${counterSub}`}>/ {String(filtered.length).padStart(2, '0')}</span>
                        </div>
                        {current.spice && (
                            <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 mb-3 ${spiceColor[current.spice]}`}>
                                <Flame className="w-3 h-3" />
                                <span className="text-xs font-black tracking-widest">{current.spice.toUpperCase()}</span>
                            </div>
                        )}
                        <h2 className={`text-3xl font-black leading-none mb-3 ${titleColor}`}>{current.name}</h2>
                        <p className={`text-sm leading-relaxed mb-5 ${descColor}`}>{current.desc}</p>
                        <div className="flex items-center gap-4 mb-5">
                            <div>
                                <p className={`text-xs font-bold tracking-widest mb-1 ${priceLabel}`}>PRICE</p>
                                <p className={`font-black text-2xl ${priceColor}`}>{current.price}</p>
                            </div>
                            <button className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                                Order Now <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <DotsIndicator count={filtered.length} active={currentIndex} />
                            <div className="flex gap-2">
                                <button onClick={() => navigate('left')} className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all ${navBtn}`}>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => navigate('right')} className={`w-10 h-10 border rounded-full flex items-center justify-center transition-all ${navBtn}`}>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── DESKTOP ── */}
                <div className="relative z-10 hidden md:flex h-[85vh] max-w-7xl mx-auto px-6 items-center">
                    <div className="grid md:grid-cols-2 gap-16 items-center w-full">

                        {/* Left — Info */}
                        <div key={current.id + 'info'} style={infoStyle}>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className={`font-black text-6xl leading-none ${counterMain}`}>{String(currentIndex + 1).padStart(2, '0')}</span>
                                <span className={`font-bold text-xl ${counterSub}`}>/ {String(filtered.length).padStart(2, '0')}</span>
                            </div>
                            {current.spice && (
                                <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 ${spiceColor[current.spice]}`}>
                                    <Flame className="w-3 h-3" />
                                    <span className="text-xs font-black tracking-widest">{current.spice.toUpperCase()}</span>
                                </div>
                            )}
                            <h2 className={`text-5xl md:text-6xl font-black leading-none mb-6 ${titleColor}`}>{current.name}</h2>
                            <p className={`text-lg leading-relaxed mb-10 max-w-sm ${descColor}`}>{current.desc}</p>
                            <div className="flex items-center gap-6 mb-10">
                                <div>
                                    <p className={`text-xs font-bold tracking-widest mb-1 ${priceLabel}`}>PRICE</p>
                                    <p className={`font-black text-3xl ${priceColor}`}>{current.price}</p>
                                </div>
                                <button className="group flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                                    Order Now
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <DotsIndicator count={filtered.length} active={currentIndex} />
                        </div>

                        {/* Right — Image stack */}
                        <div className="relative flex items-center justify-center">
                            {filtered.length > 1 && prev?.imageUrl && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-20 h-32 rounded-2xl overflow-hidden z-10 hidden lg:block" style={peekStyle}>
                                    <Image src={prev.imageUrl} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>
                            )}
                            <button onClick={() => navigate('left')}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border rounded-full flex items-center justify-center transition-all duration-300 hidden lg:flex ${navBtn}`}>
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div key={current.id + 'img'} className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/30 z-20 mx-16" style={imgStyle}>
                                {current.imageUrl
                                    ? <Image src={current.imageUrl} alt={current.name} fill className="object-cover" priority />
                                    : <div className={`w-full h-full flex items-center justify-center font-bold ${isDark ? 'bg-white/5 text-white/20' : 'bg-gray-100 text-gray-300'}`}>No Image</div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <div className={`absolute bottom-4 left-4 backdrop-blur-sm border rounded-xl px-3 py-2 ${cardBadgeBg}`}>
                                    <p className={`text-xs ${cardBadgeText}`}>crafted for</p>
                                    <p className={`font-black text-sm ${cardBadgeMain}`}>100 Hours</p>
                                </div>
                            </div>

                            <button onClick={() => navigate('right')}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border rounded-full flex items-center justify-center transition-all duration-300 hidden lg:flex ${navBtn}`}>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            {filtered.length > 1 && next?.imageUrl && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-20 h-32 rounded-2xl overflow-hidden z-10 hidden lg:block" style={peekStyle}>
                                    <Image src={next.imageUrl} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Strip */}
            <div className="bg-yellow-400 py-10 text-center">
                <p className="text-black font-black text-2xl mb-2">{"CAN'T DECIDE?"}</p>
                <p className="text-black/60 mb-6">Let our staff guide you to your perfect bowl.</p>
                <a href="/contact" className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all duration-300">
                    Ask Us Anything
                </a>
            </div>
        </section>
    )
}