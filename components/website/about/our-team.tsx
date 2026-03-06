import Image from 'next/image'

export function OurTeam() {
    return (
        <section className="py-24 bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block bg-yellow-400/10 text-yellow-400 text-sm font-bold px-4 py-2 rounded-full mb-4 border border-yellow-400/20">The People Behind The Curry</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        MEET THE
                        <span className="block text-yellow-400">TEAM</span>
                    </h2>
                </div>

                {/* Single full-width team photo */}
                <div className="relative rounded-3xl overflow-hidden border border-yellow-400/20 mb-12">
                    <div className="relative h-[500px]">
                        <Image
                            src="/images/chef.jpg"
                            alt="100 Hours Curry Team"
                            fill
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <p className="text-yellow-400 font-bold text-sm mb-2 tracking-widest">OUR CREW</p>
                                    <h3 className="text-3xl md:text-4xl font-black text-white">The People Who Make</h3>
                                    <h3 className="text-3xl md:text-4xl font-black text-yellow-400">Every Bowl Perfect</h3>
                                </div>
                                <div className="flex gap-4">
                                    {[
                                        { value: '20+', label: 'Team Members' },
                                        { value: '5★', label: 'Avg Rating' },
                                    ].map(({ value, label }) => (
                                        <div key={label} className="bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                                            <p className="text-2xl font-black text-yellow-400">{value}</p>
                                            <p className="text-white/50 text-xs mt-1">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
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