import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Globe2, Sparkles, Navigation } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
    const container = useRef(null);

    useGSAP(() => {
        // Hero content reveal
        gsap.from('.hero-reveal', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power3.out',
        });

        // Parallax values section
        gsap.from('.value-item', {
            scrollTrigger: {
                trigger: '.values-section',
                start: 'top 80%',
            },
            x: (index) => (index % 2 === 0 ? -100 : 100),
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.3,
        });
    }, { scope: container });

    return (
        <div ref={container} className="relative min-h-screen w-full overflow-hidden bg-base-100 text-base-content hide-scrollbar">

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 sm:px-12 lg:px-24">
                
                {/* --- HERO SECTION --- */}
                <section className="relative min-h-[70vh] flex flex-col justify-center items-start pt-12">
                    {/* Decorative overlap element */}
                    <div className="hero-reveal hidden md:block absolute right-0 top-1/4 w-[40vw] h-[30vw] border border-base-content/10 rounded-t-full rounded-bl-full rotate-[-15deg] -z-10 bg-base-200/50 backdrop-blur-sm" />
                
                    <div className="max-w-4xl relative z-10 w-full">
                        <h1 className="hero-reveal text-[clamp(4rem,10vw,8rem)] font-black leading-[0.85] tracking-tighter uppercase text-base-content">
                            Find Your <br/>
                            <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-accent inline-block pb-4 border-b-8 border-accent">
                                People.
                            </span>
                        </h1>
                        
                        <div className="hero-reveal mt-12 md:pl-24 w-full md:w-[70%] lg:w-[50%]">
                            <p className="text-xl md:text-2xl text-base-content/80 font-light leading-relaxed border-l-[3px] border-primary pl-6 py-2">
                                Bonded is a radical experiment in human connection. We don't just match profiles; we align frequencies, ideas, and passions in a fragmented digital world.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- MISSION CARDS --- */}
                <section className="mission-section mt-32 w-full pb-32">
                    <div className="relative w-full max-w-6xl mx-auto px-4 md:min-h-150 flex flex-col md:block">
                        
                        {/* Mission Fragment 1 */}
                        <div className="mission-card group relative z-10 w-full md:w-[60%] p-8 md:p-16 bg-base-100 border border-base-300 rounded-tr-[120px] rounded-bl-[120px] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 left-0 w-2 h-full bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
                            <Users className="w-12 h-12 text-primary mb-8" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold mb-4">The Collective</h3>
                            <p className="text-base-content/70 leading-relaxed text-lg font-light">
                                We believe great ideas die in isolation. Bonded exists to bridge the gap between "I have an idea" and "we built a movement." Find co-founders, collaborators, and comrades instantly.
                            </p>
                        </div>

                        {/* Mission Fragment 2 */}
                        <div className="mission-card group relative z-20 w-full md:w-[50%] md:absolute md:top-32 md:right-8 p-8 md:p-16 mt-8 md:mt-0 bg-primary text-primary-content rounded-tl-[100px] rounded-br-[100px] shadow-2xl hover:-translate-y-4 transition-transform duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-2 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
                            <Globe2 className="w-12 h-12 text-accent mb-8" strokeWidth={1.5} />
                            <h3 className="text-3xl font-bold mb-4">Borderless Unity</h3>
                            <p className="text-primary-content/80 leading-relaxed text-lg font-light">
                                Geography is an illusion. We connect you based on what you love, not where you live. Our algorithms ignore the noise and focus entirely on shared purpose and complementary skills.
                            </p>
                            {/* Decorative circle inside card */}
                            <div className="absolute opacity-10 bg-base-100 w-64 h-64 rounded-full -bottom-12 -right-12 mix-blend-overlay" />
                        </div>
                    </div>
                </section>

                {/* --- VALUES SECTION --- */}
                <section className="values-section py-48 border-t border-base-300/50 mt-12 relative overflow-hidden">
                
                    <div className="absolute top-[10%] left-0 w-full pointer-events-none select-none overflow-hidden opacity-5 dark:opacity-[0.02]">
                        <h2 className="text-[15vw] font-black uppercase leading-[0.8] whitespace-nowrap text-base-content overflow-hidden">
                            OUR DNA OUR DNA
                        </h2>
                    </div>

                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-base-100 border border-base-300 rounded-full z-10">
                        <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-32 items-center text-center">
                        
                        <div className="value-item max-w-3xl">
                            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black uppercase leading-none text-base-content mb-8">
                                The <span className="text-primary italic">Formula.</span>
                            </h2>
                            <div className="w-32 h-0.5 bg-accent mx-auto mb-8" />
                            <p className="text-xl md:text-2xl text-base-content/70 font-light max-w-2xl mx-auto">
                                Bonded isn't trying to be "another social network." We are a utility for human assembly. We thrive on the weird, the passionate, and the driven. 
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-16 md:gap-32 px-4 w-full justify-center">
                            <div className="value-item w-full md:w-96 text-left border-l-4 border-primary pl-8 bg-base-100/50 backdrop-blur-md p-8 rounded-tr-3xl rounded-br-3xl">
                                <h4 className="text-2xl font-bold text-base-content mb-4 font-mono">01. Authenticity</h4>
                                <p className="text-base-content/60 text-lg font-light">No fake personas. Real connections demand radical honesty and active participation from day one.</p>
                            </div>
                            
                            <div className="value-item w-full md:w-96 text-left border-l-4 border-accent pl-8 md:mt-32 bg-base-100/50 backdrop-blur-md p-8 rounded-tr-3xl rounded-br-3xl">
                                <h4 className="text-2xl font-bold text-base-content mb-4 font-mono">02. Momentum</h4>
                                <p className="text-base-content/60 text-lg font-light">Groups are just chat rooms without action. We architect environments that ruthlessly force progress.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* --- FOOTER --- */}
                <section className="pb-32 pt-16">
                    <div className="relative w-full h-[40vh] min-h-75 flex items-center justify-center bg-base-200 overflow-hidden rounded-t-[150px] rounded-b-[40px] border border-base-300">
                        <div className="z-10 text-center px-4">
                            <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase text-base-content">
                                Ready to <span className="italic font-light text-primary">Merge?</span>
                            </h2>
                            <button onClick={() => window.location.href='/signup'} className="group relative px-8 py-4 bg-transparent border border-base-content text-base-content font-bold uppercase tracking-widest overflow-hidden transition-colors hover:text-base-100">
                                <span className="relative z-10 flex items-center gap-2">
                                <Navigation className="w-5 h-5" /> Start Exploring
                                </span>
                                <div className="absolute inset-0 h-full w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 bg-base-content z-0" />
                            </button>
                        </div>
                        
                    </div>
                </section>

            </div>
        </div>
    );
}
