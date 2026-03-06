'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Flame, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'

const categories = [
    { id: 'maindish', label: 'Main Dish' },
    { id: 'sidedish', label: 'Side Dish' },
    { id: 'hot', label: 'Hot Drinks' },
    { id: 'iced', label: 'Iced Drinks' },
]

type MenuItem = {
    id: string
    name: string
    desc: string
    price: string
    category: string
    spice: string | null
    imageUrl: string | null
    isActive: boolean
    order: number
}

const spiceColor: Record<string, string> = {
    'Mild': 'text-green-400 border-green-400/40',
    'Medium': 'text-orange-400 border-orange-400/40',
    'Hot': 'text-red-400 border-red-400/40',
    'Extra Hot': 'text-red-500 border-red-500/40',
}

export function MenuGrid() {
    const [activeCategory, setActiveCategory] = useState('maindish')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [animating, setAnimating] = useState(false)
    const [direction, setDirection] = useState<'left' | 'right'>('right')
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [loading, setLoading] = useState(true)
    const touchStartX = useRef<number | null>(null)
    const touchStartY = useRef<number | null>(null)

    useEffect(() => {
        fetch('/api/website/menu')
            .then(res => res.json())
            .then(data => {
                setMenuItems(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const filtered = menuItems.filter(i => i.category === activeCategory && i.isActive)
    const current = filtered[currentIndex]
    const prev = filtered[(currentIndex - 1 + filtered.length) % filtered.length]
    const next = filtered[(currentIndex + 1) % filtered.length]

    const navigate = useCallback((dir: 'left' | 'right') => {
        if (animating || filtered.length <= 1) return
        setDirection(dir)
        setAnimating(true)
        setTimeout(() => {
            setCurrentIndex((idx) =>
                dir === 'right'
                    ? (idx + 1) % filtered.length
                    : (idx - 1 + filtered.length) % filtered.length
            )
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
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
            navigate(deltaX < 0 ? 'right' : 'left')
        }
        touchStartX.current = null
        touchStartY.current = null
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
    const peekStyle = {
        opacity: animating ? 0 : 0.25,
        transition: 'opacity 0.35s ease',
    }

    const DotsIndicator = ({ count, active }: { count: number; active: number }) => {
        if (count <= 1) return null
        if (count <= 7) {
            return (
                <div className="flex gap-1.5 items-center">
                    {Array.from({ length: count }).map((_, i) => (
                        <button key={i} onClick={() => setCurrentIndex(i)}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: i === active ? '1.5rem' : '0.375rem',
                                height: '0.375rem',
                                backgroundColor: i === active ? '#facc15' : 'rgba(255,255,255,0.2)',
                            }}
                        />
                    ))}
                </div>
            )
        }
        return (
            <div className="flex items-center gap-2">
                <div className="h-0.5 w-8 bg-yellow-400 rounded-full" />
                <span className="text-white/30 text-xs font-bold">{active + 1} / {count}</span>
            </div>
        )
    }

    const CategoryTabs = () => (
        <div className="border-b border-white/5 sticky top-16 z-30 bg-black/90 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
                {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                        className={`relative px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm font-black tracking-widest whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'}`}>
                        {cat.label.toUpperCase()}
                        {activeCategory === cat.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />}
                    </button>
                ))}
            </div>
        </div>
    )

    if (loading) return (
        <section className="bg-black min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </section>
    )

    if (!current) return (
        <section className="bg-black min-h-screen">
            <CategoryTabs />
            <div className="flex items-center justify-center h-[60vh] text-white/20 font-bold">Belum ada menu di kategori ini</div>
        </section>
    )

    return (
        <section className="bg-black min-h-screen">
            <CategoryTabs />

            <div className="relative overflow-hidden">
                {/* Blurred BG */}
                <div className="absolute inset-0">
                    {current.imageUrl && (
                        <Image src={current.imageUrl} alt="" fill className="object-cover blur-3xl opacity-15 scale-110" priority />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                </div>

                {/* ── MOBILE ── */}
                <div className="relative z-10 md:hidden flex flex-col min-h-[90vh] px-5 pt-8 pb-6"
                    onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                    <div key={current.id + 'img-m'} className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black mb-6" style={imgStyle}>
                        {current.imageUrl ? (
                            <Image src={current.imageUrl} alt={current.name} fill className="object-cover" priority />
                        ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-bold">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
                            <p className="text-white/40 text-xs">crafted for</p>
                            <p className="text-white font-black text-sm">100 Hours</p>
                        </div>
                    </div>

                    <div key={current.id + 'info-m'} style={infoStyle} className="flex-1">
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-yellow-400 font-black text-4xl leading-none">{String(currentIndex + 1).padStart(2, '0')}</span>
                            <span className="text-white/20 font-bold text-lg">/ {String(filtered.length).padStart(2, '0')}</span>
                        </div>
                        {current.spice && (
                            <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 mb-3 ${spiceColor[current.spice]}`}>
                                <Flame className="w-3 h-3" />
                                <span className="text-xs font-black tracking-widest">{current.spice.toUpperCase()}</span>
                            </div>
                        )}
                        <h2 className="text-3xl font-black text-white leading-none mb-3">{current.name}</h2>
                        <p className="text-white/40 text-sm leading-relaxed mb-5">{current.desc}</p>
                        <div className="flex items-center gap-4 mb-5">
                            <div>
                                <p className="text-white/20 text-xs font-bold tracking-widest mb-1">PRICE</p>
                                <p className="text-yellow-400 font-black text-2xl">{current.price}</p>
                            </div>
                            <button className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                                Order Now <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <DotsIndicator count={filtered.length} active={currentIndex} />
                            <div className="flex gap-2">
                                <button onClick={() => navigate('left')} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => navigate('right')} className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
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
                                <span className="text-yellow-400 font-black text-6xl leading-none">{String(currentIndex + 1).padStart(2, '0')}</span>
                                <span className="text-white/20 font-bold text-xl">/ {String(filtered.length).padStart(2, '0')}</span>
                            </div>
                            {current.spice && (
                                <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 ${spiceColor[current.spice]}`}>
                                    <Flame className="w-3 h-3" />
                                    <span className="text-xs font-black tracking-widest">{current.spice.toUpperCase()}</span>
                                </div>
                            )}
                            <h2 className="text-5xl md:text-6xl font-black text-white leading-none mb-6">{current.name}</h2>
                            <p className="text-white/40 text-lg leading-relaxed mb-10 max-w-sm">{current.desc}</p>
                            <div className="flex items-center gap-6 mb-10">
                                <div>
                                    <p className="text-white/20 text-xs font-bold tracking-widest mb-1">PRICE</p>
                                    <p className="text-yellow-400 font-black text-3xl">{current.price}</p>
                                </div>
                                <button className="group flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-yellow-400/20">
                                    Order Now
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                            <DotsIndicator count={filtered.length} active={currentIndex} />
                        </div>

                        {/* Right — Image stack dengan peek */}
                        <div className="relative flex items-center justify-center">

                            {/* Peek PREV — di luar, sebelah kiri */}
                            {filtered.length > 1 && prev?.imageUrl && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-20 h-32 rounded-2xl overflow-hidden z-10 hidden lg:block" style={peekStyle}>
                                    <Image src={prev.imageUrl} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40" />
                                </div>
                            )}

                            {/* Tombol PREV — kiri gambar */}
                            <button onClick={() => navigate('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 hover:text-black text-white transition-all duration-300 hidden lg:flex">
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Main image */}
                            <div key={current.id + 'img'} className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black z-20 mx-16" style={imgStyle}>
                                {current.imageUrl ? (
                                    <Image src={current.imageUrl} alt={current.name} fill className="object-cover" priority />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-bold">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2">
                                    <p className="text-white/40 text-xs">crafted for</p>
                                    <p className="text-white font-black text-sm">100 Hours</p>
                                </div>
                            </div>

                            {/* Tombol NEXT — kanan gambar */}
                            <button onClick={() => navigate('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 hover:text-black text-white transition-all duration-300 hidden lg:flex">
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Peek NEXT — di luar, sebelah kanan */}
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