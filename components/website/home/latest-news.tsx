'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Instagram, Play } from 'lucide-react'

type SosmedPost = {
    id: string
    type: string
    src: string
    link: string
    order: number
    isActive: boolean
}

const INSTAGRAM_URL = 'https://www.instagram.com/100hourscurry'

export function LatestNews() {
    const [posts, setPosts] = useState<SosmedPost[]>([])

    useEffect(() => {
        fetch('/api/admin/sosmed')
            .then((r) => r.json())
            .then((data) => {
                const active = Array.isArray(data) ? data.filter((p: SosmedPost) => p.isActive) : []
                setPosts(active)
            })
            .catch(() => setPosts([]))
    }, [])

    if (posts.length === 0) return null

    return (
        <section className="py-24 bg-black">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="inline-block bg-yellow-400/10 text-yellow-400 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">
                            Instagram
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white">
                            FOLLOW OUR
                            <span className="block text-yellow-400">JOURNEY</span>
                        </h2>
                    </div>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-2xl font-black text-sm hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all duration-300 self-start md:self-auto"
                    >
                        <Instagram className="w-4 h-4" />
                        @100hourscurry
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    {posts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link || INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-400/40 transition-all duration-300"
                        >
                            <Image
                                src={post.src}
                                alt="Instagram post"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                            {post.type === 'video' && (
                                <div className="absolute top-2 right-2 z-10">
                                    <div className="w-7 h-7 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <Play className="w-3 h-3 text-white fill-white" />
                                    </div>
                                </div>
                            )}

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/30">
                                    <Instagram className="w-5 h-5 text-black" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-yellow-400/30 text-yellow-400 px-6 py-3 rounded-2xl font-black text-sm hover:bg-yellow-400 hover:text-black transition-all duration-300"
                    >
                        <Instagram className="w-4 h-4" />
                        View More on Instagram
                    </a>
                </div>

            </div>
        </section>
    )
}