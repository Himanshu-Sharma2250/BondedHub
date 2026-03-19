import React, { useRef } from 'react';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const container = useRef(null);
    const navigate = useNavigate();

    useGSAP(() => {
        // Floating ambient blobs
        gsap.to('.ambient-blob', {
            y: 'random(-50, 50)',
            x: 'random(-50, 50)',
            rotation: 'random(-20, 20)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(4, 7)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.3,
        });

        // Hero Parallax Elements
        gsap.from('.hero-title-main', {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: 'power4.out',
            stagger: 0.2
        });
        
        gsap.to('.hero-bg-text', {
            y: 200,
            scrollTrigger: {
                trigger: '.hero-section',
                scroller: container.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            }
        });

        // Footer reveal
        gsap.from('.footer-massive', {
            scrollTrigger: {
                trigger: 'footer',
                scroller: container.current,
                start: 'top 90%'
            },
            y: 150,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

    }, { scope: container });

    return (
        <div ref={container} className='relative h-screen w-full overflow-x-hidden overflow-y-auto bg-base-100 text-base-content hide-scrollbar'>
            {/* Ambient Background layer */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-30 dark:opacity-15 z-0">
                <div className="ambient-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/40 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                <div className="ambient-blob absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent/30 blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
            </div>

            <div className="relative z-50">
                <Navbar />
            </div>

            {/* --- HERO SECTION --- */}
            <main className='hero-section relative min-h-[90vh] flex flex-col justify-center items-center px-4 md:px-12 lg:px-24 pt-20 z-10'>
                {/* Background Massive Text */}
                <div className="hero-bg-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-5 dark:opacity-5 pointer-events-none select-none z-0">
                    <h1 className="text-[20vw] font-black uppercase leading-none overflow-hidden whitespace-nowrap">
                        BONDED BONDED
                    </h1>
                </div>

                <div className='relative z-10 flex flex-col items-center justify-center w-full max-w-6xl text-center mt-12'>
                    <div className="overflow-hidden mb-4 p-4">
                        <h1 className='hero-title-main text-[clamp(3.5rem,8vw,7rem)] font-black leading-[0.85] uppercase tracking-tighter text-base-content'>
                            Create Amazing<br/>
                            <span className="relative inline-block mt-2">
                                <span className="absolute -inset-1 bg-accent/20 skew-y-3 pointer-events-none -z-10" />
                                <span className='text-transparent bg-clip-text bg-linear-to-br from-primary to-accent'>
                                    Projects
                                </span>
                            </span>
                            <br/>Together.
                        </h1>
                    </div>
                    
                    <div className="hero-title-main mt-12 max-w-2xl border-l-4 border-primary pl-6 text-left self-center md:self-end md:mr-[10%] backdrop-blur-sm bg-base-100/30 p-6 rounded-br-3xl">
                        <p className='text-lg md:text-2xl text-base-content/80 font-light leading-relaxed'>
                            Find teammates you can actually rely on. Bonded matches you with verified developers, designers & creators who share your work style and values.
                        </p>
                        <div className='mt-8 flex gap-4'>
                            <Button name="Get Started Now" bgColor="primary" btnSize="20px" onClick={() => navigate('/signup')} />
                        </div>
                    </div>
                </div>
            </main>

            {/* --- FEATURES SECTION --- */}
            <section className='relative z-10 py-32 px-4 md:px-12 lg:px-24 overflow-hidden'>
                <div className='text-center mb-24'>
                    <h2 className='text-[clamp(2.5rem,5vw,5rem)] font-black text-base-content uppercase leading-none'>
                        The <span className="text-primary italic font-light">Ecosystem.</span>
                    </h2>
                    <div className="w-24 h-1 bg-accent mx-auto mt-6" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col gap-48 relative">
                    <div className="absolute top-0 bottom-0 left-8.75 md:left-1/2 w-0.5 bg-linear-to-b from-primary via-accent to-transparent opacity-20 hidden lg:block" />
                    {/* CLUSTER 1: Connect & Assemble */}
                    <div className="feature-cluster relative">
                        <h3 className="text-3xl font-bold font-mono pl-16 md:pl-0 md:text-center mb-16 text-primary">01 / ASSEMBLE</h3>
                        
                        <div className="relative flex flex-col gap-16 md:gap-24">
                            <FeatureCard 
                                align="left"
                                title="Collaborative"
                                text="Create or join Teams of your batches, compete with other teams and build network."
                            />
                            <FeatureCard 
                                align="right"
                                title="Join Request"
                                text="Request multiple teams to join with transparent application tracking."
                            />
                            <FeatureCard 
                                align="left"
                                title="Management"
                                text="Leader review application and add member base on skills and requirements."
                            />
                        </div>
                    </div>

                    {/* CLUSTER 2: Execute & Manage */}
                    <div className="feature-cluster relative">
                        <h3 className="text-3xl font-bold font-mono pl-16 md:pl-0 md:text-center mb-16 text-accent">02 / EXECUTE</h3>
                        
                        <div className="relative flex flex-col gap-16 md:gap-24">
                            <FeatureCard 
                                align="right"
                                title="Focused Work"
                                text="Team members focus on a single task at a time, reducing distractions and increasing productivity."
                            />
                            <FeatureCard 
                                align="left"
                                title="Peer Reviews"
                                text="Give and receive constructive feedback and learn by collaboration."
                            />
                            <FeatureCard 
                                align="right"
                                title="Activity History"
                                text="All Users and Teams activity stored for future word and collaboration."
                            />
                        </div>
                    </div>

                    {/* CLUSTER 3: Grow & Shine */}
                    <div className="feature-cluster relative">
                        <h3 className="text-3xl font-bold font-mono pl-16 md:pl-0 md:text-center mb-16 text-primary">03 / GROW</h3>
                        
                        <div className="relative flex flex-col gap-16 md:gap-24">
                            <FeatureCard 
                                align="left"
                                title="Leadership Skills"
                                text="Enhance the Leadership and management skills by leading a Team which build job-ready skills."
                            />
                            <FeatureCard 
                                align="right"
                                title="Proof of work"
                                text="Everything you create builds a public portfolio you can proudly share with others."
                            />
                            <FeatureCard 
                                align="left"
                                title="Recommendation"
                                text="Work hard and get recommended by your Batch Teachers and stand out from crowd."
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* FOOTER  */}
            <footer className='relative z-10 bg-base-300/30 border-t border-base-300 pt-32 pb-12 overflow-hidden mt-32'>
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="footer-massive text-[18vw] font-black uppercase leading-[0.75] text-transparent bg-clip-text bg-linear-to-b from-base-content/80 to-base-content/10 mb-8 transition-transform hover:scale-105 duration-700">
                        BONDED.
                    </h2>
                    <p className='text-base-content/60 font-light tracking-widest uppercase'>Thanks for using 😸</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ align, title, text }) => {
    const alignmentClasses = align === 'left' 
        ? 'md:mr-auto md:ml-0 rounded-tr-[80px] rounded-bl-[80px] border-l-4 border-primary' 
        : 'md:ml-auto md:mr-0 rounded-tl-[80px] rounded-br-[80px] border-l-4 md:border-l-0 md:border-r-4 border-accent text-left md:text-right';

    return (
        <div className={`feature-card relative w-full md:w-[45%] bg-base-100 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 ${alignmentClasses}`}>
            <div className={`flex flex-col gap-4 ${align === 'right' ? 'md:items-end' : 'md:items-start'}`}>
                <h4 className="text-2xl font-bold text-base-content uppercase">{title}</h4>
                <p className="text-lg text-base-content/70 font-light leading-relaxed">{text}</p>
            </div>
            {/* Organic overlap element */}
            <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-base-content/5 pointer-events-none -z-10 ${align === 'left' ? '-right-16' : '-left-16'}`} />
        </div>
    );
};

export default LandingPage;