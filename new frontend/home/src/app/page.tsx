'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Navigation menu items
const menuItems = [
  { label: 'Home', href: '#' },
  { label: 'Vehicles', href: '#vehicles' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

// Featured vehicles for slider
const featuredVehicles = [
  {
    id: 1,
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    price: 'Contact for price',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&q=80',
    location: 'Copenhagen',
  },
  {
    id: 2,
    brand: 'Lamborghini',
    model: 'Huracán EVO',
    year: 2024,
    price: 'Contact for price',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    location: 'Copenhagen',
  },
  {
    id: 3,
    brand: 'Bentley',
    model: 'Continental GT',
    year: 2024,
    price: 'Contact for price',
    image: 'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80',
    location: 'Aarhus',
  },
  {
    id: 4,
    brand: 'Porsche',
    model: 'Taycan Turbo',
    year: 2024,
    price: 'Contact for price',
    image: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80',
    location: 'Copenhagen',
  },
  {
    id: 5,
    brand: 'Lamborghini',
    model: 'Urus',
    year: 2024,
    price: 'Contact for price',
    image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&q=80',
    location: 'Odense',
  },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 400
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-20">
          {/* Logo */}
          <a href="#" className="relative z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white"
            >
              SERENE
            </motion.div>
          </a>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 flex flex-col justify-center items-center w-12 h-12 group"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-white block mb-1.5"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-white block mb-1.5"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-white block"
            />
          </button>
        </nav>
      </header>

      {/* Menu Overlay */}
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
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl md:text-6xl font-light text-white hover:text-neutral-400 transition-colors duration-300 tracking-wider"
                  >
                    {item.label}
                  </motion.a>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute bottom-12 text-neutral-500 text-sm tracking-widest"
              >
                LUXURY AUTOMOTIVE EXPERIENCE
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background with Ken Burns Effect */}
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
          {/* Overlay gradient */}
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
              Exclusive Automotive Dealership
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: videoLoaded ? 1 : 0, y: videoLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-[0.1em] mb-8"
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
            <a
              href="#vehicles"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-white text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
            >
              Explore Collection
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
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

      {/* Featured Vehicles Slider Section */}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide">
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
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5">
                  <span className="text-white text-xs tracking-wider">{vehicle.location}</span>
                </div>
              </div>

              {/* Vehicle Info */}
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

              {/* Arrow on Hover */}
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

      {/* Brand Video Section */}
      <section className="relative bg-neutral-950 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-neutral-500 text-sm tracking-[0.4em] uppercase mb-4 block">
              Our Brands
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide">
              Exclusive Partnerships
            </h2>
          </motion.div>

          {/* Brand Logos/Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Porsche', tagline: 'There is no substitute' },
              { name: 'Lamborghini', tagline: 'Expect the unexpected' },
              { name: 'Bentley', tagline: 'Beyond luxury' },
            ].map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center p-8 border border-neutral-800 hover:border-neutral-600 transition-colors duration-500 group cursor-pointer"
              >
                <h3 className="text-2xl md:text-3xl font-light text-white tracking-wider mb-4 group-hover:text-neutral-300 transition-colors duration-300">
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

      {/* Services Section */}
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide">
              Premium Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: 'Flex Leasing',
                description: 'Tailored leasing solutions designed around your lifestyle and preferences.',
              },
              {
                title: 'Vehicle Sourcing',
                description: 'We locate and acquire your dream vehicle from anywhere in the world.',
              },
              {
                title: 'Concierge Service',
                description: 'Dedicated support for maintenance, storage, and all your automotive needs.',
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

      {/* Contact Section */}
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-wide mb-8">
              Experience Serene
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
              Begin your journey towards automotive excellence. 
              Our team is ready to assist you in finding your perfect vehicle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="mailto:hello@serene.com"
                className="px-8 py-4 bg-white text-black text-sm tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors duration-300"
              >
                Contact Us
              </a>
              <a
                href="tel:+1234567890"
                className="px-8 py-4 border border-neutral-700 text-white text-sm tracking-[0.2em] uppercase hover:border-white transition-colors duration-300"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-light tracking-[0.3em] text-white">
              SERENE
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                Privacy
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                Terms
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors duration-300 text-sm tracking-wider">
                Contact
              </a>
            </div>
            <div className="text-neutral-600 text-sm">
              © 2024 Serene. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
