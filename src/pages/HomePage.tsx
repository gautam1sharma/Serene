import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// ─── Navigation menu items ──────────────────────────────────────────────────
const menuItems = [
  { label: 'Home',        to: '/' },
  { label: 'Vehicles',    to: '/cars' },
  { label: 'Dealerships', to: '/dealerships' },
  { label: 'About',       to: '/about' },
  { label: 'Support',     to: '/support' },
];

// ─── Featured vehicles ─────────────────────────────────────────────────────
const featuredVehicles = [
  {
    id: 'serene-aura',
    brand: 'Serene',
    model: 'Aura',
    year: 2024,
    price: 'From $28,500',
    image: 'https://images.unsplash.com/photo-1714538701027-790deaef725b?w=800&q=80',
    location: 'Los Angeles',
  },
  {
    id: 'serene-volt',
    brand: 'Serene',
    model: 'Volt',
    year: 2024,
    price: 'From $48,000',
    image: 'https://images.unsplash.com/photo-1716558964076-1abe07448abf?w=800&q=80',
    location: 'Los Angeles',
  },
  {
    id: 'serene-prestige',
    brand: 'Serene',
    model: 'Prestige',
    year: 2024,
    price: 'From $58,000',
    image: 'https://images.unsplash.com/photo-1702558306309-6d51217f9bed?w=800&q=80',
    location: 'Pasadena',
  },
  {
    id: 'serene-haven',
    brand: 'Serene',
    model: 'Haven',
    year: 2024,
    price: 'From $35,000',
    image: 'https://images.unsplash.com/photo-1740098159737-73673d741ebb?w=800&q=80',
    location: 'Santa Monica',
  },
  {
    id: 'serene-lyric',
    brand: 'Serene',
    model: 'Lyric',
    year: 2024,
    price: 'From $28,000',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80',
    location: 'Los Angeles',
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────
export const HomePage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth',
      });
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'customer': return '/customer';
      case 'dealer':   return '/dealer';
      case 'manager':  return '/manager';
      case 'ceo': case 'admin': return '/ceo';
      default: return '/login';
    }
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* ═══ NAVIGATION HEADER ════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          {/* Logo */}
          <Link to="/" className="relative z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white font-serif"
            >
              SERENE
            </motion.div>
          </Link>

          {/* Right side: auth buttons + hamburger */}
          <div className="flex items-center gap-6 relative z-50">
            {/* Desktop auth links */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={getDashboardLink()}
                  className="px-6 py-2.5 bg-white text-black text-xs tracking-[0.2em] uppercase font-medium hover:bg-neutral-200 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white/70 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-white text-black text-xs tracking-[0.2em] uppercase font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger / X button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative w-12 h-12 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="absolute w-7 h-[2px] bg-white rounded-full"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute w-7 h-[2px] bg-white rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="absolute w-7 h-[2px] bg-white rounded-full"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* ═══ MENU OVERLAY ═════════════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <nav className="flex flex-col items-center space-y-8">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl md:text-6xl font-light text-white hover:text-neutral-400 transition-colors duration-300 tracking-wider"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Mobile auth links */}
                <div className="md:hidden flex flex-col items-center gap-4 pt-8 border-t border-neutral-800">
                  {isAuthenticated ? (
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMenuOpen(false)}
                      className="px-8 py-3 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="text-white/70 hover:text-white text-lg tracking-wider transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="px-8 py-3 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute bottom-12 text-neutral-500 text-sm tracking-widest"
              >
                THE FUTURE OF QUIET MOTION
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HERO SECTION ═════════════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover animate-kenburns"
          >
            <source
              src="https://semlerpremium-enejcjgjffegdzb6.northeurope-01.azurewebsites.net/media/lzdihiqn/semlerpremium-frontpage.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-4"
          >
            <span className="text-white/70 text-sm md:text-base tracking-[0.4em] uppercase">
              Luxury Automotive Dealership
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.1em] mb-8 font-serif"
          >
            SERENE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-12"
          >
            Drive the calm.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Link
              to="/cars"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
            >
              Explore Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/50 text-xs tracking-[0.3em] uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURED VEHICLES SLIDER ═════════════════════════════════════ */}
      <section id="vehicles" className="relative bg-black py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <span className="text-neutral-500 text-sm tracking-[0.4em] uppercase mb-4 block">
                Our Collection
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide font-serif">
                Featured Vehicles
              </h2>
            </div>

            {/* Slider Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollSlider('left')}
                className="w-12 h-12 border border-neutral-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="w-12 h-12 border border-neutral-700 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Horizontal Scrollable Vehicle Cards */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {featuredVehicles.map((vehicle, index) => (
            <motion.article
              key={vehicle.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex-shrink-0 w-[85vw] md:w-[400px] group cursor-pointer"
              style={{ scrollSnapAlign: 'start' }}
              onClick={() => navigate(`/cars/${vehicle.id}`)}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5">
                  <span className="text-white text-xs tracking-wider">{vehicle.location}</span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 text-sm tracking-wider uppercase">{vehicle.brand}</span>
                  <span className="text-neutral-600 text-sm">{vehicle.year}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-white tracking-wide group-hover:text-neutral-300 transition-colors duration-300">
                  {vehicle.model}
                </h3>
                <p className="text-neutral-400 text-sm tracking-wider">{vehicle.price}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-white/0 group-hover:text-white/70 transition-all duration-300">
                <span className="text-sm tracking-wider uppercase">View Details</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile Scroll Hint */}
        <div className="md:hidden flex justify-center mt-8 gap-2">
          {featuredVehicles.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-neutral-700" />
          ))}
        </div>
      </section>

      {/* ═══ BRAND VALUES SECTION ═════════════════════════════════════════ */}
      <section id="about" className="relative bg-neutral-950 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-neutral-500 text-sm tracking-[0.4em] uppercase mb-4 block">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide font-serif">
              What Defines Serene
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Minimalist Design',   tagline: 'Absolute simplicity, nothing unnecessary' },
              { name: 'Electric Innovation',  tagline: 'Zero emissions, maximum performance' },
              { name: 'Sustainable Luxury',   tagline: 'Premium materials, ethically sourced' },
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center p-8 border border-neutral-800 hover:border-neutral-600 transition-colors duration-500 group cursor-pointer"
              >
                <h3 className="text-2xl md:text-3xl font-light text-white tracking-wider mb-4 group-hover:text-neutral-300 transition-colors duration-300 font-serif">
                  {brand.name}
                </h3>
                <p className="text-neutral-500 text-sm tracking-wider uppercase">
                  {brand.tagline}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES SECTION ═════════════════════════════════════════════ */}
      <section id="services" className="relative bg-black py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-neutral-500 text-sm tracking-[0.4em] uppercase mb-4 block">
              What We Offer
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide font-serif">
              Premium Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Test Drive Experience',
                description: 'Book a private test drive at any of our dealerships. Experience Serene\'s whisper-quiet electric performance first-hand.',
              },
              {
                title: 'Personalised Configuration',
                description: 'Work with our design team to create a vehicle that is uniquely yours — from exterior colour to interior trim details.',
              },
              {
                title: 'Concierge Delivery',
                description: 'White-glove delivery to your doorstep with a dedicated specialist to walk you through every feature of your new vehicle.',
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center p-8 border border-neutral-800 hover:border-neutral-600 transition-colors duration-500"
              >
                <h3 className="text-xl font-light text-white tracking-wider mb-4">
                  {service.title}
                </h3>
                <p className="text-neutral-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT / CTA SECTION ════════════════════════════════════════ */}
      <section id="contact" className="relative bg-neutral-950 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-neutral-500 text-sm tracking-[0.4em] uppercase mb-4 block">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide mb-8 font-serif">
              Experience Serene
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
              Begin your journey towards automotive excellence.
              Visit one of our dealerships or sign in to browse our full collection online.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to={getDashboardLink()}
                  className="px-8 py-4 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors duration-300"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-8 py-4 border border-neutral-700 text-white text-sm tracking-[0.2em] uppercase hover:border-white transition-colors duration-300"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="bg-black border-t border-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-light tracking-[0.3em] text-white font-serif">
              SERENE
            </div>
            <div className="flex items-center gap-8">
              <Link to="/about" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                About
              </Link>
              <Link to="/dealerships" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                Dealerships
              </Link>
              <Link to="/support" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                Support
              </Link>
            </div>
            <div className="text-neutral-600 text-sm">
              © {new Date().getFullYear()} Serene Automotive. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
