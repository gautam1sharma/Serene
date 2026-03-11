import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll-triggered animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observerRef.current?.observe(section));

    return () => observerRef.current?.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'customer': return '/customer';
      case 'dealer': return '/dealer';
      case 'manager': return '/manager';
      case 'ceo': case 'admin': return '/ceo';
      default: return '/dashboard';
    }
  };

  return (
    <div className="landing-page bg-[#f8f6f6] text-slate-900 font-display min-h-screen overflow-x-hidden">
      <div className="px-4 sm:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col w-full max-w-[1200px] flex-1">

          {/* === Header === */}
          <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-4 sm:px-10 py-4 mb-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="text-[#1a2a44] size-6 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">electric_car</span>
              </div>
              <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-wider uppercase">
                Serene
              </h2>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex flex-1 justify-end gap-8">
              <nav className="flex items-center gap-8">
                <a href="#philosophy" className="text-slate-600 hover:text-[#1a2a44] transition-colors text-sm font-medium tracking-wide uppercase">
                  Philosophy
                </a>
                <a href="#vehicle" className="text-slate-600 hover:text-[#1a2a44] transition-colors text-sm font-medium tracking-wide uppercase">
                  The Vehicle
                </a>
                <a href="#innovation" className="text-slate-600 hover:text-[#1a2a44] transition-colors text-sm font-medium tracking-wide uppercase">
                  Innovation
                </a>
              </nav>

              {isAuthenticated ? (
                <Link
                  to={getDashboardLink()}
                  className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#1a2a44] hover:bg-slate-800 transition-colors text-white text-sm font-bold tracking-wide uppercase shadow-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 border border-[#1a2a44] hover:bg-[#1a2a44] hover:text-white transition-colors text-[#1a2a44] text-sm font-bold tracking-wide uppercase"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/admin-login"
                    className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#1a2a44] hover:bg-slate-800 transition-colors text-white text-sm font-bold tracking-wide uppercase shadow-sm"
                  >
                    DMS Portal
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden text-slate-600 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </header>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-400 ${
              mobileMenuOpen ? 'max-h-96 mb-6' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col gap-4 px-4 py-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 text-sm font-medium tracking-wide uppercase py-2">Philosophy</a>
              <a href="#vehicle" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 text-sm font-medium tracking-wide uppercase py-2">The Vehicle</a>
              <a href="#innovation" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 text-sm font-medium tracking-wide uppercase py-2">Innovation</a>
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                {isAuthenticated ? (
                  <Link to={getDashboardLink()} className="rounded-full h-10 px-6 bg-[#1a2a44] text-white text-sm font-bold tracking-wide uppercase flex items-center justify-center">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="rounded-full h-10 px-6 border border-[#1a2a44] text-[#1a2a44] text-sm font-bold tracking-wide uppercase flex items-center justify-center">
                      Customer Sign In
                    </Link>
                    <Link to="/admin-login" className="rounded-full h-10 px-6 bg-[#1a2a44] text-white text-sm font-bold tracking-wide uppercase flex items-center justify-center">
                      DMS Portal
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* === Hero Section === */}
          <div
            id="hero-section"
            data-animate
            className={`mb-16 transition-all duration-1000 ${
              isVisible('hero-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div
              className="flex min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-center justify-center p-8 relative overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(248, 246, 246, 0.4), rgba(248, 246, 246, 0.8)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAp34F-OWyGEP4Itkbli4ru5NFmNCIWHsFVE4mjNdkNqyuQ4U9MgUEnM3svHOR-mT54T1PGcVhRerqD6aL4sulPmo7U67O5FzRa1SJUWTSR_tCW_UuXuzuWc_IhXdaUnbAW6C0UHUljRTrYNYhE8fWPhjePJ8iw99yzhnZIhV6u-YbwrLBlgSM4gkWWgbfiYhb8v-uhYdM2VG6uE2plguDmN8bxJ3AvIu3SpGhPJOmQhHlmaJfiz-3YoT2Z-RFKDe3nsK5nW1J72_x7")`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8f6f6]/90 pointer-events-none" />
              <div className="flex flex-col gap-6 text-center z-10 max-w-3xl">
                <h1 className="text-slate-900 text-5xl md:text-7xl font-light leading-tight tracking-tight">
                  The Future of Elegance.
                </h1>
                <h2 className="text-slate-600 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                  Experience the Serene electric vehicle, where absolute minimalist design meets unparalleled cutting-edge innovation.
                </h2>
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href="#vehicle"
                    className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-slate-900 text-white text-sm font-bold tracking-wider uppercase transition-transform hover:scale-105"
                  >
                    Discover Serene
                  </a>
                  {!isAuthenticated && (
                    <Link
                      to="/register"
                      className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 border-2 border-slate-300 text-slate-700 text-sm font-bold tracking-wider uppercase transition-all hover:border-slate-900 hover:bg-white"
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* === Philosophy Section === */}
          <div className="flex flex-col gap-12 px-4 py-16 border-t border-slate-200" id="philosophy">
            <div
              id="philosophy-header"
              data-animate
              className={`flex flex-col md:flex-row gap-8 items-start md:items-end justify-between transition-all duration-1000 ${
                isVisible('philosophy-header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col gap-4 max-w-2xl">
                <h2 className="text-slate-900 tracking-tight text-4xl font-light leading-tight">
                  Our Philosophy
                </h2>
                <p className="text-slate-600 text-lg font-light leading-relaxed">
                  We believe in complete harmony between advanced technology and natural simplicity. Serene embodies a minimalist approach, meticulously stripping away the unnecessary to leave only pure, elegant, and functional design.
                </p>
              </div>
            </div>

            <div
              id="philosophy-cards"
              data-animate
              className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${
                isVisible('philosophy-cards') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {[
                {
                  title: 'Minimalist Aesthetics',
                  desc: 'Clean lines, soft pastel hues, and an uncluttered interior architecture designed for a profoundly calming driving experience.',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtREY2luWqiwV4k89g7YJbBlbK8fwGmqXW3j92eYHN0cP4iqtysB1epx4X9j6z-J0kH4CiG1ENrDQF3J6FSsDFPAiL1KRA3qhmgWKF1WmTOXQr0gUWdDPPmyQBMlgsuTsoHZxVRJEBKDulaPZVKHfTQ9H4Bh1nlrmFjRfpcrRVFNaGKGFpGjirx-CXqhGZFnFeKY7VQVKAylev1b9siJmvyeOTOVB_VjdvH9CH7M1cckkpupWuBDBJNEyttyhaGVF85mvwKWGRqIVV',
                },
                {
                  title: 'Sustainable Luxury',
                  desc: 'Meticulously crafted with premium eco-friendly, ethically sourced materials without ever compromising on sophisticated elegance.',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKfJLEycryBEa2WVImHRKLApCLfZq6V20_iBt5wlGYT8mU-gzvR0E1p4yoOfm1aOJ02VUcgmyQEYxFxqMaYdcShj9_m6Lzt48yFUokwsAb8xRiwACq9EHAjVcRCcwniTq2srnv9EuIwfsih4iPWOZJ-h8YLNrQ9H1DBifFHTJk9CD-Ehla7dXIJ7yyaNLJhWRyjgPfNlNrwhxC0Fl2YBVFyqwAoNrX1klckSTCNXTnduCpl3LC1gBmzsKJm8Jn7UlXrzd8C79Q7gi1',
                },
                {
                  title: 'Intuitive Technology',
                  desc: 'Flawless, invisible integration of advanced AI features that quietly anticipate your every need before you do.',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWnCDfLIGpSngb67yNG9weUJJrdRDtRiFcX6KYi37qQLKwHsCgckGxCdTGK6ZebVDw1awUm8ZnUVeSvJog8iYQY3-FRodkX2n-QBaRDsE3irn8koZQXlYUHGG9H3vKym2wVrl_FXE9ZKthDph5C-aSqceHiV0uXESkSP8HU5fIrtfObD3CEet7xR96IhAr9T14p-5uR-V4u--rlK5jk7aH11AxSlyhW4pgZ6KvbtIWKNSFOaJfD_AllZ-mk5fnY0e9JM0a5bukO7qr',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-4 group cursor-pointer">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div>
                    <p className="text-slate-900 text-lg font-medium mb-2">{item.title}</p>
                    <p className="text-slate-500 text-base font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* === The Vehicle Feature Image === */}
          <div className="mt-16" id="vehicle">
            <div
              id="vehicle-image"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible('vehicle-image') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div
                className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-2xl min-h-[500px] relative"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDulc9Zh-gAqXZtNwWT9jVTh72qRM-wl-iQuSQA54sxXS2trIsW7c7GZp1dmVlWC7IDewHeruDTTBI2qpoEdtwSDKbWWAdIwwc4rLuPCXuVQyJFUmz8B1yFXTSDUDEOivv6e6IjUQjEV2MmZytZFUbLKO_GH72o8uz6Hq929LagWcYt-6CW_cbXgLvpXbk5Y0zfwqhFhiuuhgxO-ns_ZIy-M0xcDoNAMZMIFF5vrhzI8OUT5Yla7BqV44olscwi56OrIH_QFQH7YvAZ")`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="flex flex-col p-8 z-10">
                  <p className="text-white text-sm tracking-widest uppercase mb-2">The Vehicle</p>
                  <p className="text-white tracking-tight text-4xl font-light leading-tight max-w-xl">
                    Form Follows Perfection.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* === Innovation Specs === */}
          <div
            id="innovation-specs"
            data-animate
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-16 transition-all duration-1000 ${
              isVisible('innovation-specs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {[
              { icon: 'air', title: 'Aerodynamic Profile', desc: 'Sculpted by the wind for maximum range and whisper-quiet efficiency.' },
              { icon: 'panorama_horizontal', title: 'Panoramic Canopy', desc: 'Experience the world above with edge-to-edge smart glass technology.' },
              { icon: 'energy_savings_leaf', title: 'Zero Emissions', desc: 'A pure, devastatingly powerful electric powertrain leaving no trace behind.' },
              { icon: 'volume_off', title: 'Sanctuary Silence', desc: 'A cabin acoustically engineered to be your ultimate peaceful retreat.' },
            ].map((spec, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-[#1a2a44] bg-[#1a2a44]/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">{spec.icon}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-slate-900 text-lg font-medium">{spec.title}</h2>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* === CTA Section === */}
          <div
            id="cta-section"
            data-animate
            className={`py-16 border-t border-slate-200 transition-all duration-1000 ${
              isVisible('cta-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-slate-900 text-3xl md:text-4xl font-light mb-4">
                Ready to experience Serene?
              </h2>
              <p className="text-slate-500 font-light text-lg mb-8">
                Book a test drive at any of our dealerships, or sign in to explore our complete inventory.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardLink()}
                    className="rounded-full h-12 px-8 bg-[#1a2a44] text-white text-sm font-bold tracking-wider uppercase flex items-center justify-center hover:bg-slate-800 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="rounded-full h-12 px-8 bg-[#1a2a44] text-white text-sm font-bold tracking-wider uppercase flex items-center justify-center hover:bg-slate-800 transition-colors"
                    >
                      Customer Sign In
                    </Link>
                    <Link
                      to="/admin-login"
                      className="rounded-full h-12 px-8 border-2 border-slate-300 text-slate-700 text-sm font-bold tracking-wider uppercase flex items-center justify-center hover:border-[#1a2a44] hover:bg-white transition-all"
                    >
                      Dealership Portal
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* === Footer === */}
          <footer className="mt-12 py-8 border-t border-slate-200 text-center">
            <p className="text-slate-400 text-sm font-light">
              © 2024 Serene Automotive. All rights reserved.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};
