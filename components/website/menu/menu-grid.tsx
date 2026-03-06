'use client'

import { useEffect, useState, useCallback } from 'react'
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
        if (animating) return
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

    useEffect(() => {
        setCurrentIndex(0)
    }, [activeCategory])

    useEffect(() => {
        const timer = setInterval(() => navigate('right'), 4000)
        return () => clearInterval(timer)
    }, [navigate])

    const infoStyle = {
        opacity: animating ? 0 : 1,
        transform: animating
            ? `translateX(${direction === 'right' ? '-30px' : '30px'})`
            : 'translateX(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
    }

    const imgStyle = {
        opacity: animating ? 0 : 1,
        transform: animating
            ? `scale(0.96) translateX(${direction === 'right' ? '30px' : '-30px'})`
            : 'scale(1) translateX(0)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
    }

    if (loading) return (
        <section className="bg-black min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </section>
    )

    if (!current) return (
        <section className="bg-black min-h-screen">
            <div className="border-b border-white/5 sticky top-16 z-30 bg-black/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className={`relative px-8 py-5 text-sm font-black tracking-widest whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'}`}>
                            {cat.label.toUpperCase()}
                            {activeCategory === cat.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-center h-[85vh] text-white/20 font-bold">
                Belum ada menu di kategori ini
            </div>
        </section>
    )

    return (
        <section className="bg-black min-h-screen">
            {/* Category Tabs */}
            <div className="border-b border-white/5 sticky top-16 z-30 bg-black/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
                    {categories.map((cat) => (
                        <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                            className={`relative px-8 py-5 text-sm font-black tracking-widest whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'text-yellow-400' : 'text-white/30 hover:text-white/60'}`}>
                            {cat.label.toUpperCase()}
                            {activeCategory === cat.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Slider */}
            <div className="relative h-[85vh] overflow-hidden">
                {/* Blurred BG */}
                <div className="absolute inset-0">
                    {current.imageUrl && (
                        <Image src={current.imageUrl} alt="" fill className="object-cover blur-3xl opacity-15 scale-110" priority />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
                </div>

                {/* Content Grid */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center">
                    <div className="grid md:grid-cols-2 gap-16 items-center w-full">
                        {/* Left — Text Info */}
                        <div key={current.id + 'info'} style={infoStyle}>
                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-yellow-400 font-black text-6xl leading-none">
                                    {String(currentIndex + 1).padStart(2, '0')}
                                </span>
                                <span className="text-white/20 font-bold text-xl">
                                    / {String(filtered.length).padStart(2, '0')}
                                </span>
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
                                <button className="group flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20">
                                    Order Now
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                {filtered.map((_, i) => (
                                    <button key={i} onClick={() => setCurrentIndex(i)} className="rounded-full transition-all duration-300"
                                        style={{ width: i === currentIndex ? '2rem' : '0.5rem', height: '0.5rem', backgroundColor: i === currentIndex ? '#facc15' : 'rgba(255,255,255,0.15)' }} />
                                ))}
                            </div>
                        </div>

                        {/* Right — Images */}
                        <div className="relative flex items-center justify-center">
                            {prev?.imageUrl && (
                                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-20 h-28 rounded-2xl overflow-hidden opacity-25 hidden lg:block z-10">
                                    <Image src={prev.imageUrl} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/50" />
                                </div>
                            )}

                            <div key={current.id + 'img'} className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black z-20" style={imgStyle}>
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

                            {next?.imageUrl && (
                                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-20 h-28 rounded-2xl overflow-hidden opacity-25 hidden lg:block z-10">
                                    <Image src={next.imageUrl} alt="" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/50" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 hover:text-black text-white transition-all duration-300">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => navigate('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:border-yellow-400 hover:text-black text-white transition-all duration-300">
                    <ChevronRight className="w-5 h-5" />
                </button>
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