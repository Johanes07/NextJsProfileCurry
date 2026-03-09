'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useTheme } from 'next-themes'

const positions = [
    { id: 1, title: 'Head Chef', dept: 'Kitchen', type: 'Full Time', location: 'Jakarta Selatan', desc: 'Lead our kitchen team and maintain the quality of our signature 100-hour curry process. You will oversee daily operations, mentor junior chefs, and ensure every dish meets our uncompromising standards.', requirements: ['Min. 5 years experience as Head Chef or Sous Chef', 'Deep knowledge of Japanese curry techniques', 'Strong leadership and team management skills', 'Passion for quality and consistency'] },
    { id: 2, title: 'Sous Chef', dept: 'Kitchen', type: 'Full Time', location: 'Jakarta Selatan', desc: 'Support the Head Chef in daily kitchen operations and help maintain our legendary curry quality.', requirements: ['Min. 3 years experience in professional kitchen', 'Knowledge of Japanese or curry cuisine is a plus', 'Ability to work under pressure', 'Team player with strong work ethic'] },
    { id: 3, title: 'Restaurant Manager', dept: 'Operations', type: 'Full Time', location: 'Jakarta Selatan', desc: 'Oversee day-to-day restaurant operations, manage staff, and ensure an exceptional dining experience for every guest.', requirements: ['Min. 3 years experience in F&B management', 'Strong leadership and communication skills', 'Experience with POS systems and inventory', 'Customer-first mindset'] },
    { id: 4, title: 'Service Crew', dept: 'Front of House', type: 'Full Time / Part Time', location: 'Jakarta Selatan', desc: 'Be the face of 100 Hours Curry. You will greet guests, take orders, and ensure everyone leaves with a smile.', requirements: ['Friendly and energetic personality', 'Willing to learn and grow', 'Available on weekends', 'No prior experience required'] },
    { id: 5, title: 'Social Media & Content Creator', dept: 'Marketing', type: 'Full Time', location: 'Remote / Jakarta', desc: 'Tell the story of 100 Hours Curry through stunning content across Instagram, TikTok, and beyond.', requirements: ['Portfolio of food/brand content', 'Proficient in photo and video editing', 'Understanding of current social media trends', 'Creative eye and storytelling ability'] },
]

const deptColor: Record<string, string> = {
    'Kitchen': 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    'Operations': 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    'Front of House': 'bg-green-400/10 text-green-400 border-green-400/20',
    'Marketing': 'bg-pink-400/10 text-pink-400 border-pink-400/20',
}

export function CareerList() {
    const [expanded, setExpanded] = useState<number | null>(null)
    const [applying, setApplying] = useState<number | null>(null)
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const isDark = mounted ? resolvedTheme === 'dark' : true

    return (
        <section className={`py-24 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-500 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-yellow-400/20">Open Positions</span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <h2 className={`text-4xl md:text-5xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {positions.length} ROLES<span className="block text-yellow-500">AVAILABLE</span>
                        </h2>
                        <p className={`max-w-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>We hire for attitude and train for skill. If you love food and people, apply now.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {positions.map((pos) => (
                        <div key={pos.id} className={`border rounded-3xl overflow-hidden transition-all duration-300 ${isDark
                            ? 'border-white/5 hover:border-yellow-400/20 bg-zinc-950'
                            : 'border-gray-100 hover:border-yellow-400/30 bg-white shadow-sm'
                            }`}>
                            <button className="w-full text-left p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                onClick={() => setExpanded(expanded === pos.id ? null : pos.id)}>
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{pos.title}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${deptColor[pos.dept]}`}>{pos.dept}</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${isDark ? 'bg-white/5 text-white/40 border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                            <Clock className="w-3 h-3" /> {pos.type}
                                        </span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1 ${isDark ? 'bg-white/5 text-white/40 border-white/10' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                            <MapPin className="w-3 h-3" /> {pos.location}
                                        </span>
                                    </div>
                                </div>
                                <div className={`shrink-0 ${isDark ? 'text-white/30' : 'text-gray-300'}`}>
                                    {expanded === pos.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </div>
                            </button>

                            {expanded === pos.id && (
                                <div className={`px-8 pb-8 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                    <p className={`leading-relaxed mt-6 mb-6 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{pos.desc}</p>
                                    <p className={`font-black text-sm tracking-widest mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>REQUIREMENTS</p>
                                    <ul className="space-y-2 mb-8">
                                        {pos.requirements.map((req) => (
                                            <li key={req} className={`flex items-start gap-3 text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                                                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 shrink-0" />{req}
                                            </li>
                                        ))}
                                    </ul>
                                    {applying === pos.id ? (
                                        <ApplyForm posTitle={pos.title} onClose={() => setApplying(null)} isDark={isDark} />
                                    ) : (
                                        <button onClick={() => setApplying(pos.id)}
                                            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-400/20">
                                            Apply Now <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={`mt-16 border border-yellow-400/20 rounded-3xl p-10 text-center ${isDark ? 'bg-zinc-950' : 'bg-white shadow-sm'}`}>
                    <p className="text-yellow-500 font-black text-xl mb-2">{"Don't see a fit?"}</p>
                    <p className={`mb-6 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Send us your CV anyway. We are always on the lookout for great talent.</p>
                    <a href="mailto:career@100hourscurry.com"
                        className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black hover:scale-105 transition-all duration-300">
                        Send Open Application
                    </a>
                </div>
            </div>
        </section>
    )
}

function ApplyForm({ posTitle, onClose, isDark }: { posTitle: string; onClose: () => void; isDark: boolean }) {
    const [done, setDone] = useState(false)

    if (done) return (
        <div className={`border border-yellow-400/20 rounded-2xl p-8 text-center ${isDark ? 'bg-yellow-400/5' : 'bg-yellow-50'}`}>
            <p className="text-yellow-500 font-black text-xl mb-2">Application Sent!</p>
            <p className={`text-sm mb-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>We will review your application and get back to you soon.</p>
            <button onClick={onClose} className="text-yellow-500 font-bold text-sm hover:underline">Close</button>
        </div>
    )

    const inputClass = `w-full border rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400/40 text-sm transition-all ${isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/20' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`

    return (
        <div className={`border rounded-2xl p-6 space-y-4 ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <p className={`font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Apply for: <span className="text-yellow-500">{posTitle}</span>
            </p>
            {[{ placeholder: 'Full Name', type: 'text' }, { placeholder: 'Email Address', type: 'email' }, { placeholder: 'Phone Number', type: 'tel' }].map(({ placeholder, type }) => (
                <input key={placeholder} type={type} placeholder={placeholder} className={inputClass} />
            ))}
            <input type="text" placeholder="LinkedIn or Portfolio URL (optional)" className={inputClass} />
            <textarea rows={3} placeholder="Why do you want to join 100 Hours Curry?" className={`${inputClass} resize-none`} />
            <div className="flex gap-3">
                <button onClick={() => setDone(true)} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-black hover:scale-[1.02] transition-all">
                    Submit Application
                </button>
                <button onClick={onClose} className={`px-5 border rounded-xl font-bold hover:bg-opacity-10 transition-all ${isDark ? 'bg-white/5 border-white/10 text-white/40' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                    Cancel
                </button>
            </div>
        </div>
    )
}