'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Timer, Leaf, Heart, FlaskConical } from 'lucide-react'

const values = [
    {
        icon: Timer,
        title: 'No Shortcuts',
        desc: 'We cook every batch for exactly 100 hours. Not 99, not 101. The process is sacred and non-negotiable.',
    },
    {
        icon: Leaf,
        title: 'Finest Ingredients',
        desc: 'We source 27 hand-selected spices from trusted farms. Quality ingredients are the foundation of great curry.',
    },
    {
        icon: Heart,
        title: 'Made with Love',
        desc: 'Every bowl is prepared with genuine care. We treat each serving as if cooking for our own family.',
    },
    {
        icon: FlaskConical,
        title: 'Obsessive Quality',
        desc: 'Every batch is tasted and adjusted by our head chef. Consistency is our promise to every customer.',
    },
]

export function OurValues() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-amber-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">
                        What We Stand For
                    </span>
                    <h2 className={`text-4xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        OUR<span className="text-yellow-500"> VALUES</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className={`group rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-2 ${isDark
                                ? 'bg-zinc-950 border-white/5 hover:border-yellow-400/30 hover:bg-yellow-400/5'
                                : 'bg-white border-gray-100 hover:border-yellow-400/40 hover:bg-yellow-50 shadow-sm'
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${isDark
                                ? 'bg-yellow-400/10 group-hover:bg-yellow-400/20'
                                : 'bg-yellow-50 group-hover:bg-yellow-100'
                                }`}>
                                <Icon className="w-6 h-6 text-yellow-500" strokeWidth={2} />
                            </div>
                            <h3 className={`text-xl font-black mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                                {desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}