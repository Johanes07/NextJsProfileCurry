'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function OurTeam() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">The People Behind The Curry</span>
                    <h2 className={`text-4xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        MEET THE<span className="block text-yellow-500">TEAM</span>
                    </h2>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-yellow-400/20 mb-12">
                    <div className="relative h-[500px]">
                        <Image src="/images/chef.jpg" alt="100 Hours Curry Team" fill className="object-cover object-center" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <p className="text-yellow-400 font-bold text-sm mb-2 tracking-widest">OUR CREW</p>
                                    <h3 className="text-3xl md:text-4xl font-black text-white">The People Who Make</h3>
                                    <h3 className="text-3xl md:text-4xl font-black text-yellow-400">Every Bowl Perfect</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center bg-yellow-400 rounded-3xl p-12">
                    <h3 className="text-3xl md:text-4xl font-black text-black mb-4">JOIN OUR TEAM</h3>
                    <p className="text-black/60 mb-8 max-w-md mx-auto">Passionate about food? We're always looking for talented people who share our obsession.</p>
                    <a href="/contact" className="inline-flex items-center gap-2 bg-black text-yellow-400 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all duration-300">
                        Get In Touch
                    </a>
                </div>
            </div>
        </section>
    )
}