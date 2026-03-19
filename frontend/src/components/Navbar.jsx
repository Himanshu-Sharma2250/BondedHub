import { useState, useRef } from 'react';
import Button from './Button';
import { NavLink } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(useGSAP);

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const overlayRef = useRef(null);
    const linksRef = useRef([]);
    const { theme, toggleTheme } = useTheme();

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    useGSAP(() => {
        if (isMenuOpen) {
            gsap.to(overlayRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.inOut',
            });
            gsap.to(menuRef.current, {
                x: 0,
                duration: 0.4,
                ease: 'power2.out',
            });
            gsap.fromTo(
                linksRef.current,
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: 'power2.out',
                }
            );
        } else {
            gsap.to(menuRef.current, {
                x: '-100%',
                duration: 0.3,
                ease: 'power2.in',
            });
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.inOut',
            });
        }
    }, { dependencies: [isMenuOpen], scope: menuRef.current });

    return (
        <>
            <nav className="relative flex items-center justify-between px-4 py-2 bg-base-100 shadow-sm md:px-5 z-20">
                {/* Hamburger icon for mobile */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="p-1 focus:outline-none">
                        <Menu className="w-6 h-6 text-base-content" />
                    </button>
                </div>

                {/* Logo: centered on mobile, left-aligned on desktop */}
                <div className="flex-1 text-center md:text-left md:flex-none">
                    <h1 className="text-2xl font-bold text-base-content md:text-3xl">Bonded</h1>
                </div>

                {/* Desktop navigation links (hidden on mobile) */}
                <div className="hidden md:block">
                    <ul className="flex items-center gap-8">
                        <li><a href="/" className="text-base-content/70 hover:text-primary text-lg">Home</a></li>
                        <li><a href="/groups" className="text-base-content/70 hover:text-primary text-lg">Teams</a></li>
                        <li><a href="/about" className="text-base-content/70 hover:text-primary text-lg">About Us</a></li>
                        {/* <li><a href="#" className="text-base-content/70 hover:text-primary text-lg">Contact</a></li> */}
                    </ul>
                </div>

                {/* Login/Signup buttons */}
                <div className="flex items-center gap-2">
                    <NavLink to="/signin">
                        <Button name="Log In" variant="primary" size="md" />
                    </NavLink>
                    <NavLink to="/signup">
                        <Button name="Sign Up" variant="accent" size="md" />
                    </NavLink>
                    <button
                        onClick={() => {
                            toggleTheme();
                        }}
                            className="flex justify-between items-center px-2 py-1 rounded-md text-base-content hover:bg-base-200 transition-colors"
                    >
                        {theme === 'bonded' ? <Moon className="w-4" /> : <Sun className="w-4" />}
                    </button>
                </div>
            </nav>

            {/* Overlay */}
            {isMenuOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden opacity-0"
                    onClick={closeMenu}
                />
            )}

            {/* Slide‑in side menu */}
            <div
                ref={menuRef}
                className="fixed top-0 left-0 h-full w-64 bg-base-100 shadow-lg z-40 md:hidden transform -translate-x-full"
            >
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                    <h2 className="text-2xl font-bold text-base-content">Bonded</h2>
                    <button onClick={closeMenu} className="p-1 rounded-md hover:bg-base-200">
                        <X className="w-6 h-6 text-base-content" />
                    </button>
                </div>
                <ul className="flex flex-col gap-2 p-4">
                    {['Home', 'Teams', 'About Us', 'Contact'].map((item, index) => (
                        <li
                            key={item}
                            ref={(el) => (linksRef.current[index] = el)}
                        >
                            <a
                                href="#"
                                className="block py-2 text-lg text-base-content hover:text-primary hover:bg-base-200 px-2 rounded-md transition-colors"
                                onClick={closeMenu}
                            >
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;