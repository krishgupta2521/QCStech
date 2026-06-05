import React, { useEffect, useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  GraduationCap,
  Globe,
  Handshake,
  HardHat,
  Headset,
  HeartPulse,
  Hotel,
  Laptop,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Network,
  Phone,
  Share2,
  Server,
  Shield,
  ShoppingCart,
  Store,
  UserCheck,
  Video,
  X,
} from 'lucide-react'

// --- Custom Hooks ---

// Hook for scroll reveal animations
const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [options])

  return [ref, isIntersecting]
}

// --- Reusable Components ---

const Reveal = ({ children, className = '', delay = 0, from = 'up', distance = 60 }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  })

  const getTransform = () => {
    if (isVisible) return 'translate(0,0) scale(1) rotateX(0deg)'
    switch (from) {
      case 'left':  return `translate(-${distance}px, 0) scale(0.95)`
      case 'right': return `translate(${distance}px, 0) scale(0.95)`
      case 'scale': return 'translate(0, 20px) scale(0.85)'
      case 'flip':  return 'translate(0, 30px) rotateX(20deg) scale(0.95)'
      default:      return `translate(0, ${distance}px)`
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

const Counter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 })

  useEffect(() => {
    if (!isVisible) return
    let startTimestamp = null
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [isVisible, target, duration])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

// --- Main App Component ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFormSubmit = (event) => {
    event.preventDefault()
    setFormStatus('success')
    setTimeout(() => {
      setFormStatus('')
      event.target.reset()
    }, 3000)
  }

  return (
    <div className="font-sans text-gray-100 antialiased selection:bg-blue-500 selection:text-white" style={{background:'#020c1b'}}>
      {/* ── SCROLL PROGRESS BAR ── */}
      <div
        className="fixed top-0 left-0 z-[100] h-[3px] transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, #1d4ed8, #06b6d4, #0891b2, #1d4ed8)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s linear infinite',
          boxShadow: '0 0 12px rgba(29,78,216,0.9), 0 0 24px rgba(6,182,212,0.6)',
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        /* ── AURORA BACKGROUND ── */
        @keyframes aurora1 {
          0%   { transform: translate(0%,   0%)   scale(1); }
          25%  { transform: translate(8%,  -12%)  scale(1.15); }
          50%  { transform: translate(-5%,  8%)   scale(0.92); }
          75%  { transform: translate(12%,  5%)   scale(1.08); }
          100% { transform: translate(0%,   0%)   scale(1); }
        }
        @keyframes aurora2 {
          0%   { transform: translate(0%,  0%)   scale(1); }
          33%  { transform: translate(-10%, 15%) scale(1.2); }
          66%  { transform: translate(15%, -8%)  scale(0.88); }
          100% { transform: translate(0%,  0%)   scale(1); }
        }
        @keyframes aurora3 {
          0%   { transform: translate(0,0)      scale(1)    rotate(0deg); }
          50%  { transform: translate(-15%,12%) scale(1.25) rotate(15deg); }
          100% { transform: translate(0,0)      scale(1)    rotate(0deg); }
        }
        @keyframes stars-drift {
          from { transform: translateY(0px); }
          to   { transform: translateY(-120px); }
        }
        @keyframes mesh-shift {
          0%,100% { opacity: 0.04; transform: scale(1) rotate(0deg); }
          50%     { opacity: 0.07; transform: scale(1.05) rotate(1deg); }
        }

        /* ── ANIMATIONS ── */
        @keyframes blob {
          0%   { transform: translate(0,0) scale(1); }
          33%  { transform: translate(30px,-50px) scale(1.1); }
          66%  { transform: translate(-20px,20px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes float-particle {
          0%,100% { transform: translateY(0) translateX(0); opacity:0.3; }
          25%     { transform: translateY(-40px) translateX(20px); opacity:0.9; }
          50%     { transform: translateY(-20px) translateX(-15px); opacity:0.5; }
          75%     { transform: translateY(-55px) translateX(25px); opacity:0.8; }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(29,78,216,0.5); }
          70%  { box-shadow: 0 0 0 18px rgba(29,78,216,0); }
          100% { box-shadow: 0 0 0 0 rgba(29,78,216,0); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 20px rgba(29,78,216,0.35), 0 0 60px rgba(6,182,212,0.15); }
          50%     { box-shadow: 0 0 50px rgba(29,78,216,0.7), 0 0 100px rgba(6,182,212,0.4); }
        }
        @keyframes scan-line {
          0%   { top: -5%; }
          100% { top: 105%; }
        }
        @keyframes ticker {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @keyframes border-dance {
          0%,100% { border-color: rgba(29,78,216,0.30); }
          33%     { border-color: rgba(6,182,212,0.40); }
          66%     { border-color: rgba(6,182,212,0.40); }
        }
        @keyframes float-y {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-18px); }
        }
        @keyframes glow-text {
          0%,100% { text-shadow: 0 0 20px rgba(29,78,216,0.45), 0 0 40px rgba(6,182,212,0.25); }
          50%     { text-shadow: 0 0 40px rgba(29,78,216,0.8), 0 0 80px rgba(6,182,212,0.5); }
        }

        /* ── UTILITY CLASSES ── */
        .animate-blob      { animation: blob 7s infinite; }
        .animate-aurora1   { animation: aurora1 18s ease-in-out infinite; }
        .animate-aurora2   { animation: aurora2 24s ease-in-out infinite; }
        .animate-aurora3   { animation: aurora3 30s ease-in-out infinite; }
        .animate-float-y   { animation: float-y 5s ease-in-out infinite; }
        .animate-glow-text { animation: glow-text 3s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-6000 { animation-delay: 6s; }

        .glass-panel {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.10);
        }
        .glass-panel-light {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .site-surface { background: transparent; }

        .dark-card {
          background: rgba(15, 5, 35, 0.55);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(29,78,216,0.18);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
        }
        .dark-card:hover {
          border-color: rgba(29,78,216,0.35);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(29,78,216,0.18), inset 0 1px 0 rgba(255,255,255,0.10);
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #34d399, #67e8f9, #60a5fa);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .section-divider { border-top: 1px solid rgba(29,78,216,0.12); }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-wrapper {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: float-particle linear infinite;
        }
        .pulse-ring  { animation: pulse-ring 2.5s ease-out infinite; }
        .pulse-glow  { animation: pulse-glow 3s ease-in-out infinite; }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(29,78,216,0.7), rgba(6,182,212,0.7), transparent);
          animation: scan-line 3.5s linear infinite;
          z-index: 5; pointer-events: none;
        }
        .border-animate { animation: border-dance 4s ease-in-out infinite; }

        /* Stars layer */
        .stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 10% 80%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 50%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 15% 55%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.4) 0%, transparent 100%);
          animation: stars-drift 60s linear infinite;
        }
      `,
        }}
      />

      {/* ── AURORA BACKGROUND ── */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Deep base */}
        <div className="absolute inset-0" style={{background:'#020c1b'}}></div>

        {/* Aurora blob 1 — Deep electric blue */}
        <div
          className="absolute animate-aurora1"
          style={{
            width: '90vw', height: '90vh',
            top: '-20%', left: '-20%',
            background: 'radial-gradient(ellipse, rgba(29,78,216,0.50) 0%, rgba(30,58,138,0.30) 35%, transparent 70%)',
            borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
            filter: 'blur(55px)',
          }}
        />
        {/* Aurora blob 2 — Cyan / sky blue */}
        <div
          className="absolute animate-aurora2"
          style={{
            width: '80vw', height: '80vh',
            top: '10%', right: '-25%',
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.38) 0%, rgba(14,116,144,0.22) 40%, transparent 70%)',
            borderRadius: '40% 60% 30% 70% / 60% 40% 60% 40%',
            filter: 'blur(65px)',
          }}
        />
        {/* Aurora blob 3 — Teal / emerald accent */}
        <div
          className="absolute animate-aurora3"
          style={{
            width: '70vw', height: '70vh',
            bottom: '-10%', left: '20%',
            background: 'radial-gradient(ellipse, rgba(20,184,166,0.28) 0%, rgba(15,118,110,0.18) 40%, transparent 70%)',
            borderRadius: '50% 50% 40% 60% / 40% 60% 50% 50%',
            filter: 'blur(75px)',
          }}
        />
        {/* Aurora blob 4 — Navy deep pulse */}
        <div
          className="absolute animate-aurora1 animation-delay-4000"
          style={{
            width: '60vw', height: '60vh',
            top: '40%', left: '40%',
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.25) 0%, transparent 65%)',
            borderRadius: '50%',
            filter: 'blur(85px)',
          }}
        />
        {/* Aurora blob 5 — Sky glow */}
        <div
          className="absolute animate-aurora2 animation-delay-2000"
          style={{
            width: '50vw', height: '50vh',
            bottom: '15%', right: '10%',
            background: 'radial-gradient(ellipse, rgba(56,189,248,0.20) 0%, transparent 65%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
          }}
        />

        {/* Stars */}
        <div className="stars" />

        {/* Grid mesh overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 34L0 84V52l28 16 28-16v32L28 100z' fill='none' stroke='rgba(29,78,216,0.07)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '56px 100px',
            animation: 'mesh-shift 12s ease-in-out infinite',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{background:'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,12,27,0.75) 100%)'}}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3'
            : 'bg-transparent py-4'
        }`}
        style={{
          top: '28px',
          ...(isScrolled ? {background: 'rgba(3,11,26,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,179,237,0.12)', boxShadow: '0 4px 32px rgba(0,0,0,0.5)'} : {})
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-cyan-500/50 transition-all duration-300">
                  <Cpu size={20} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  QCS Tech
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Services', 'Solutions', 'About', 'Projects'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.4)'}}
              >
                Get Quote
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="focus:outline-none text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 absolute w-full left-0 top-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Services', 'Solutions', 'About', 'Projects'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                >
                  {item}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 mt-4 text-center font-medium bg-blue-600 text-white rounded-md hover:bg-blue-500"
              >
                Get Quote
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Live Tech Ticker Strip */}
      <div
        className="fixed left-0 right-0 z-40 overflow-hidden"
        style={{ top: '3px', height: '28px', background: 'rgba(4,1,15,0.95)', borderBottom: '1px solid rgba(29,78,216,0.25)' }}
      >
        <div style={{ display: 'flex', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap', alignItems: 'center', height: '100%' }}>
          {[
            '🟣 LIVE: 99.99% Uptime Maintained',
            '⚡ Server Response: 12ms',
            '🛡️ 0 Security Incidents Today',
            '📡 Network Throughput: 10Gbps',
            '✅ 500+ Projects Delivered',
            '🔧 24/7 Support Active',
            '🌐 350+ Enterprise Clients Globally',
            '🟣 LIVE: 99.99% Uptime Maintained',
            '⚡ Server Response: 12ms',
            '🛡️ 0 Security Incidents Today',
            '📡 Network Throughput: 10Gbps',
            '✅ 500+ Projects Delivered',
            '🔧 24/7 Support Active',
            '🌐 350+ Enterprise Clients Globally',
          ].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', fontSize: '11px', color: 'rgba(96,165,250,0.9)', fontWeight: 600, letterSpacing: '0.05em', paddingLeft: '60px', paddingRight: '60px', borderRight: '1px solid rgba(29,78,216,0.18)', height: '100%' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ paddingTop: '88px' }}>
        {/* Abstract Background Shapes */}
        <div
          className="absolute inset-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.03\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left pt-10 lg:pt-0">
              <Reveal from="left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-cyan-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Enterprise Grade Solutions
                </div>
              </Reveal>
              <Reveal delay={100} from="left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                  Transforming Businesses Through{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Smart IT Solutions
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={200} from="left">
                <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0">
                  End-to-end IT Infrastructure, Hardware, Networking, CCTV
                  Surveillance, and Technology Solutions tailored for modern
                  enterprises and fast-growing businesses.
                </p>
              </Reveal>
              <Reveal delay={300} from="left">
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="#contact"
                    className="px-8 py-4 rounded-lg text-white font-semibold flex items-center justify-center gap-2 pulse-glow transition-all hover:scale-105"
                    style={{background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)', boxShadow: '0 0 30px rgba(6,182,212,0.35)'}}
                  >
                    Get Free Consultation <ArrowRight size={18} />
                  </a>
                  <a
                    href="#services"
                    className="px-8 py-4 rounded-lg glass-panel text-white font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 border-animate"
                  >
                    Explore Services
                  </a>
                </div>
              </Reveal>

              {/* Trust Indicators */}
              <Reveal delay={400} from="left">
                <div className="mt-10 pt-6 border-t border-gray-800 flex flex-wrap justify-center lg:justify-start gap-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={18} className="text-blue-500" /> ISO
                    Certified
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={18} className="text-blue-500" /> 24/7
                    Support
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <CheckCircle2 size={18} className="text-blue-500" /> 10+
                    Years Exp
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Hero Visual (Abstract Tech Illustration) */}
            <div className="hidden lg:block relative h-[500px]">
              <Reveal
                delay={200}
                from="right"
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Central Node */}
                <div className="relative w-48 h-64 glass-panel rounded-xl border border-blue-500/30 flex flex-col items-center justify-evenly p-4 z-20 shadow-2xl shadow-fuchsia-500/20">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-full h-12 bg-gray-800 rounded border border-gray-700 flex items-center px-3 gap-2"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item === 3
                            ? 'bg-red-500'
                            : 'bg-green-500 animate-pulse'
                        }`}
                      ></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                      <div className="flex-1"></div>
                      <div className="w-16 h-1 bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Orbiting Elements */}
                <div className="absolute w-80 h-80 border border-gray-700/50 rounded-full animate-[spin_20s_linear_infinite]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-800 rounded border border-blue-500 flex items-center justify-center text-cyan-400">
                    <Network size={16} />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-800 rounded border border-cyan-500 flex items-center justify-center text-cyan-400">
                    <Shield size={16} />
                  </div>
                </div>

                <div className="absolute w-96 h-96 border border-gray-700/30 rounded-full animate-[spin_30s_linear_infinite_reverse]">
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded border border-indigo-500 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
                    <Server size={16} />
                  </div>
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-gray-800 rounded border border-green-500 flex items-center justify-center text-green-400 shadow-lg shadow-green-500/20">
                    <Video size={16} />
                  </div>
                </div>

                {/* Connection Lines (Decorative) */}
                <svg
                  className="absolute inset-0 w-full h-full -z-10 opacity-20"
                  viewBox="0 0 400 400"
                >
                  <path
                    d="M 200,200 L 50,100"
                    stroke="#0ea5e9"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 200,200 L 350,100"
                    stroke="#06B6D4"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 200,200 L 50,300"
                    stroke="#8B5CF6"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 200,200 L 350,300"
                    stroke="#10B981"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg
            className="relative block w-full h-12 md:h-24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,130.23,191.56,118.5,236.4,110,279.36,83,321.39,56.44Z"
              fill="#030b1a"
            ></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-transparent relative z-10 -mt-10 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom">
            <div className="dark-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={15} />
                </div>
                <div className="text-xs font-semibold text-blue-300/70 uppercase tracking-widest">
                  Years Experience
                </div>
              </div>
              <div className="p-4 border-l border-white/10">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={500} suffix="+" />
                </div>
                <div className="text-xs font-semibold text-blue-300/70 uppercase tracking-widest">
                  Projects Delivered
                </div>
              </div>
              <div className="p-4 md:border-l border-white/10">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={350} suffix="+" />
                </div>
                <div className="text-xs font-semibold text-blue-300/70 uppercase tracking-widest">
                  Enterprise Clients
                </div>
              </div>
              <div className="p-4 border-l border-white/10">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  24/7
                </div>
                <div className="text-xs font-semibold text-blue-300/70 uppercase tracking-widest">
                  Support Available
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-transparent overflow-hidden section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Aesthetic Visual Area */}
            <Reveal from="left" className="relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-[2.5rem] transform rotate-3 blur-2xl opacity-60"></div>

              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
                  <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                    alt="Futuristic Technology Abstract"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                  />

                  {/* Overlay Gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent z-10"></div>
                </div>

                {/* Floating Widget 1: Security */}
                <div
                  className="absolute -right-6 top-10 dark-card p-4 rounded-2xl flex items-center gap-4 animate-bounce z-20"
                  style={{ animationDuration: '4s' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      Enterprise Security
                    </div>
                    <div className="text-xs text-indigo-400 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                      Active Protection
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2: Uptime */}
                <div
                  className="absolute -left-8 bottom-12 dark-card p-4 rounded-2xl flex items-center gap-4 animate-bounce z-20"
                  style={{ animationDuration: '3.5s', animationDelay: '1s' }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">
                      System Uptime
                    </div>
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                      99.99%
                    </div>
                  </div>
                </div>

                {/* Floating Widget 3: Award */}
                <div className="absolute right-12 -bottom-6 dark-card p-3 px-5 rounded-full flex items-center gap-3 z-20">
                  <Award size={18} className="text-amber-400" />
                  <span className="font-bold text-white text-sm">
                    Top Tech Partner
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} from="right">
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
                About Our Company
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Empowering Business With{' '}
                <span className="gradient-text">
                  Future-Ready
                </span>{' '}
                Tech.
              </h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                We don't just supply hardware; we architect resilient, highly
                scalable IT ecosystems. From complex server deployments to
                advanced cybersecurity protocols and smart office automation, we
                act as your definitive technology partner.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-cyan-400">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-200 font-medium pt-1">
                    Enterprise-grade hardware procurement & data center setup.
                  </span>
                </li>
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-cyan-400">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-200 font-medium pt-1">
                    Robust network architecture and seamless Wi-Fi deployment.
                  </span>
                </li>
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-cyan-400">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-200 font-medium pt-1">
                    Advanced AI-driven CCTV surveillance & access control
                    systems.
                  </span>
                </li>
              </ul>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white transition-all duration-300 gap-2 group hover:scale-105"
                style={{background: 'linear-gradient(135deg, #1d4ed8, #06b6d4)', boxShadow: '0 0 30px rgba(6,182,212,0.30)'}}
              >
                Discover Our Approach{' '}
                <ArrowRight
                  size={18}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-24 bg-transparent section-divider"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
              Core Expertise
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">
              Comprehensive IT Services
            </h2>
            <p className="mt-4 text-gray-300 text-lg">
              We deliver scalable, secure, and high-performance technology
              solutions tailored to your operational demands.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards Data Array */}
            {[
              {
                icon: <Server size={28} />,
                color: 'blue',
                title: 'Server & Datacenter',
                desc: 'End-to-end server rack installation, configuration, virtualization, and maintenance for optimal data management.',
              },
              {
                icon: <Network size={28} />,
                color: 'cyan',
                title: 'Networking & Wi-Fi',
                desc: 'Enterprise-grade structured cabling, switches, routers, and high-density Wi-Fi deployment for seamless connectivity.',
              },
              {
                icon: <Shield size={28} />,
                color: 'indigo',
                title: 'Cybersecurity',
                desc: 'Robust firewall installations, endpoint protection, and network security audits to safeguard your business data.',
              },
              {
                icon: <Video size={28} />,
                color: 'emerald',
                title: 'CCTV Surveillance',
                desc: 'High-definition IP camera systems, NVR setups, and remote monitoring solutions for comprehensive physical security.',
              },
              {
                icon: <Laptop size={28} />,
                color: 'orange',
                title: 'Hardware Solutions',
                desc: 'Procurement, setup, and bulk sales of enterprise laptops, desktops, workstations, and peripherals. New & refurbished.',
              },
              {
                icon: <Headset size={28} />,
                color: 'purple',
                title: 'AMC & IT Support',
                desc: 'Comprehensive Annual Maintenance Contracts (AMC) providing proactive monitoring, troubleshooting, and fast resolution.',
              },
            ].map((service, index) => {
              // Map colors for Tailwind
              const colorMap = {
                blue: 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
                cyan: 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white',
                indigo: 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white',
                emerald: 'bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white',
                orange: 'bg-orange-500/10 text-orange-400 group-hover:bg-orange-600 group-hover:text-white',
                purple: 'bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
                textHover: {
                  orange: 'group-hover:text-orange-600',
                  purple: 'group-hover:text-purple-600',
                },
              }

              return (
                <Reveal key={service.title} delay={index * 100} from={index % 2 === 0 ? 'left' : 'right'}>
                  <div className="dark-card rounded-2xl p-8 transition-all duration-300 group h-full flex flex-col relative overflow-hidden hover:scale-[1.03]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-bl-full -z-10 transition-all duration-300 group-hover:scale-150 group-hover:opacity-50"></div>

                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                        colorMap[service.color]
                      }`}
                    >
                      {service.icon}
                    </div>
                    <h3
                      className={`text-xl font-bold text-white mb-3 transition-colors ${
                        colorMap.textHover[service.color]
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-8 flex-grow">
                      {service.desc}
                    </p>
                    <a
                      href="#contact"
                      className={`font-semibold inline-flex items-center group/link mt-auto text-cyan-400 hover:text-cyan-300`}
                    >
                      Learn More{' '}
                      <ArrowRight
                        size={16}
                        className="ml-2 transform group-hover/link:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Floating Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0
                ? 'rgba(29,78,216,0.7)'
                : i % 3 === 1
                ? 'rgba(6,182,212,0.6)'
                : 'rgba(139,92,246,0.5)',
              animationDuration: `${Math.random() * 10 + 8}s`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Solutions Showcase */}
      <section
        id="solutions"
        className="py-24 text-white overflow-hidden relative section-divider"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-cyan-900/10 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal from="bottom" className="flex flex-col md:flex-row justify-between items-end mb-14">
            <div className="max-w-2xl">
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
                Targeted Solutions
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">
                Built For Your Industry
              </h2>
              <p className="mt-4 text-gray-400 text-lg">
                We design customized technology frameworks that address the
                unique challenges of different business environments.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <a
                href="#"
                className="text-white border border-cyan-500/40 hover:border-cyan-400 hover:text-cyan-400 px-6 py-3 rounded-full transition-all duration-300 font-medium block text-center hover:shadow-lg hover:shadow-cyan-500/20"
              >
                View All Solutions
              </a>
            </div>
          </Reveal>
        </div>

        {/* Infinite Marquee of Industry Cards */}
        <div className="marquee-wrapper py-4">
          <div className="marquee-track gap-6 px-3">
            {[
              {
                icon: <Building2 size={26} />,
                title: 'Corporate Offices',
                desc: 'Complete office setup including networking, employee workstations, biometric access, and secure Wi-Fi.',
                img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
                color: 'from-blue-600 to-cyan-700',
              },
              {
                icon: <GraduationCap size={26} />,
                title: 'Educational Institutes',
                desc: 'Smart classroom setups, campus-wide managed Wi-Fi, computer labs, and digital PA systems.',
                img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600',
                color: 'from-violet-500 to-purple-700',
              },
              {
                icon: <Store size={26} />,
                title: 'Retail Chains',
                desc: 'POS hardware, extensive CCTV coverage, inventory scanning, and reliable network backbones for retail stores.',
                img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: <HardHat size={26} />,
                title: 'Builders & Construction',
                desc: 'Rugged site networking, IP cameras for site monitoring, access control, and project management connectivity.',
                img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
                color: 'from-yellow-500 to-amber-700',
              },
              {
                icon: <HeartPulse size={26} />,
                title: 'Healthcare Facilities',
                desc: 'HIPAA-compliant networking, nurse call systems, patient monitoring, and secure data management for hospitals and clinics.',
                img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
                color: 'from-emerald-500 to-teal-700',
              },
              {
                icon: <Hotel size={26} />,
                title: 'Hospitality & Hotels',
                desc: 'High-density guest Wi-Fi, in-room entertainment systems, property management networks, and smart room automation.',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
                color: 'from-pink-500 to-rose-700',
              },
              {
                icon: <ShoppingCart size={26} />,
                title: 'Warehousing & Logistics',
                desc: 'Barcode scanning infrastructure, warehouse-wide networking, GPS tracking integration, and inventory CCTV systems.',
                img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600',
                color: 'from-cyan-500 to-blue-700',
              },
              // Duplicate set for seamless infinite loop
              {
                icon: <Building2 size={26} />,
                title: 'Corporate Offices',
                desc: 'Complete office setup including networking, employee workstations, biometric access, and secure Wi-Fi.',
                img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
                color: 'from-blue-600 to-cyan-700',
              },
              {
                icon: <GraduationCap size={26} />,
                title: 'Educational Institutes',
                desc: 'Smart classroom setups, campus-wide managed Wi-Fi, computer labs, and digital PA systems.',
                img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600',
                color: 'from-violet-500 to-purple-700',
              },
              {
                icon: <Store size={26} />,
                title: 'Retail Chains',
                desc: 'POS hardware, extensive CCTV coverage, inventory scanning, and reliable network backbones for retail stores.',
                img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: <HardHat size={26} />,
                title: 'Builders & Construction',
                desc: 'Rugged site networking, IP cameras for site monitoring, access control, and project management connectivity.',
                img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
                color: 'from-yellow-500 to-amber-700',
              },
              {
                icon: <HeartPulse size={26} />,
                title: 'Healthcare Facilities',
                desc: 'HIPAA-compliant networking, nurse call systems, patient monitoring, and secure data management for hospitals and clinics.',
                img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
                color: 'from-emerald-500 to-teal-700',
              },
              {
                icon: <Hotel size={26} />,
                title: 'Hospitality & Hotels',
                desc: 'High-density guest Wi-Fi, in-room entertainment systems, property management networks, and smart room automation.',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600',
                color: 'from-pink-500 to-rose-700',
              },
              {
                icon: <ShoppingCart size={26} />,
                title: 'Warehousing & Logistics',
                desc: 'Barcode scanning infrastructure, warehouse-wide networking, GPS tracking integration, and inventory CCTV systems.',
                img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600',
                color: 'from-cyan-500 to-blue-700',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border-animate"
                style={{ width: '340px', height: '420px', border: '1px solid rgba(192,38,211,0.2)' }}
              >
                {/* Scan line effect */}
                <div className="scan-line opacity-0 group-hover:opacity-100"></div>

                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020818] via-[#020818]/70 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                {/* Top gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-70 group-hover:opacity-100 transition-opacity`}></div>

                <div className="absolute inset-0 p-7 flex flex-col justify-end transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-5 shadow-lg pulse-ring`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-400 delay-75 leading-relaxed">
                    {card.desc}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    <span className="inline-flex items-center gap-1.5 text-cyan-400 text-sm font-semibold">
                      Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom indicator dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === 0 ? '24px' : '6px',
                height: '6px',
                background: i === 0 ? 'linear-gradient(90deg, #1d4ed8, #06b6d4)' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-transparent relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom" className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
              How We Work
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">
              Seamless Execution Process
            </h2>
            <p className="mt-4 text-gray-300 text-lg">
              A structured approach to guarantee zero downtime and perfectly
              aligned technology implementations.
            </p>
          </Reveal>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5" style={{background: 'linear-gradient(90deg, transparent, rgba(29,78,216,0.45), rgba(6,182,212,0.4), rgba(6,182,212,0.5), transparent)'}}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Consultation',
                  desc: 'Assessing your current infrastructure and understanding business requirements.',
                },
                {
                  step: '2',
                  title: 'Design & Plan',
                  desc: 'Architecting secure networks, selecting hardware, and creating blueprints.',
                  highlight: true,
                },
                {
                  step: '3',
                  title: 'Implementation',
                  desc: 'Expert installation, configuration, and integration by certified engineers.',
                },
                {
                  step: '4',
                  title: 'Support & AMC',
                  desc: 'Rigorous testing followed by ongoing 24/7 maintenance and monitoring.',
                },
              ].map((item, idx) => (
                <Reveal
                  key={item.title}
                  delay={idx * 150}
                  from={idx % 2 === 0 ? 'left' : 'right'}
                  className="relative text-center dark-card md:bg-transparent p-6 rounded-2xl md:border-none mb-4 md:mb-0"
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-6 relative z-10 transition-transform hover:scale-110 ${
                      item.highlight
                        ? 'border-4 border-blue-400/50 text-white shadow-xl shadow-blue-500/50'
                        : 'border-4 border-white/10 text-gray-300 shadow-lg'
                    }`}
                    style={item.highlight ? {background: 'linear-gradient(135deg, #3b82f6, #06b6d4)'} : {background: 'rgba(255,255,255,0.05)'}}
                  >
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two Column: Why Choose Us & Quick Project */}
      <section className="py-24 bg-transparent section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Why Choose Us */}
            <Reveal from="left">
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
                Why Choose Us
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-white mb-10">
                The QCS Tech Advantage
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: <UserCheck size={20} />,
                    title: 'Certified Experts',
                    desc: 'Our team comprises certified network engineers, security analysts, and hardware specialists.',
                  },
                  {
                    icon: <Clock size={20} />,
                    title: 'Rapid Response Times',
                    desc: 'Strict SLAs ensuring minimal downtime with prompt on-site and remote troubleshooting.',
                  },
                  {
                    icon: <Handshake size={20} />,
                    title: 'Vendor Neutral Approach',
                    desc: 'We recommend the best hardware and software combinations tailored to your needs, not vendor quotas.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex p-4 rounded-2xl dark-card hover:scale-[1.01] transition-all"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-cyan-400 flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    <div className="ml-5">
                      <h4 className="text-xl font-bold text-white">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Featured Project Container */}
            <Reveal delay={200} from="right">
              <div
                id="projects"
                className="dark-card p-8 md:p-10 rounded-[2rem] relative overflow-hidden h-full flex flex-col"
              >
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-6 py-2 rounded-bl-2xl z-10 shadow-lg shadow-blue-500/30">
                  Featured Case Study
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-2 mt-2">
                  TechHub Solutions Datacenter
                </h3>
                <p className="text-cyan-400 text-sm font-bold tracking-wide uppercase mb-6">
                  Server & Network Overhaul
                </p>

                <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg group flex-grow">
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600"
                    alt="Datacenter Network Racks"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 min-h-[200px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 rounded-2xl p-5" style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(99,179,237,0.1)'}}>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                      Challenge
                    </div>
                    <div className="text-sm font-semibold text-gray-200">
                      Outdated infrastructure causing network bottlenecks.
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                      Result
                    </div>
                    <div className="text-sm font-bold text-emerald-400">
                      300% speed increase, 99.99% uptime achieved.
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  className="w-full block text-center text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] mt-auto"
                  style={{background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 20px rgba(59,130,246,0.3)'}}
                >
                  View Full Portfolio
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-blue-600 overflow-hidden">
        {/* Background Patterns */}
        <div
          className="absolute inset-0 w-full h-full opacity-10 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"></div>
        <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[80px] opacity-60"></div>

        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Upgrade Your <br className="hidden md:block" /> IT
            Infrastructure?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Partner with experts to build secure, scalable, and future-ready
            technology solutions tailored for your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-gray-50 transition-all shadow-xl shadow-gray-900/20 text-lg"
            >
              Request a Custom Quote
            </a>
            <a
              href="tel:+1234567890"
              className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/30 text-lg"
            >
              <Phone size={20} /> Call Experts Now
            </a>
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-transparent relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <Reveal from="left">
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm">
                Get In Touch
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-white mb-6">
                Let's Discuss Your Tech Needs
              </h2>
              <p className="text-gray-300 mb-10 text-lg leading-relaxed">
                Whether you need a complete office setup, network security audit,
                or hardware procurement, our experts are ready to architect your
                solution.
              </p>

              <div className="space-y-6">
                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-blue-500/15 rounded-2xl flex items-center justify-center text-blue-400 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-white">
                      Head Office
                    </h4>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                      123 Tech Boulevard, Enterprise Park
                      <br />
                      Silicon Valley, CA 94000
                    </p>
                  </div>
                </div>

                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-cyan-500/15 rounded-2xl flex items-center justify-center text-cyan-400 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-white">
                      Email Us
                    </h4>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                      solutions@qcstech.com
                      <br />
                      support@qcstech.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-emerald-500/15 rounded-2xl flex items-center justify-center text-emerald-400 transition-colors">
                    <Phone size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-white">
                      Call Support (24/7)
                    </h4>
                    <p className="text-gray-400 mt-1 leading-relaxed">
                      +1 (800) 123-4567
                      <br />
                      +1 (800) 987-6543
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Contact Form */}
            <Reveal
              delay={200}
              from="right"
              className="dark-card p-8 md:p-10 rounded-[2rem]"
            >
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-gray-300 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                      style={{background: 'rgba(255,255,255,0.05)'}}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-bold text-gray-300 mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                      style={{background: 'rgba(255,255,255,0.05)'}}
                      placeholder="Your Company Ltd."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500"
                      style={{background: 'rgba(255,255,255,0.05)'}}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-bold text-gray-300 mb-2"
                    >
                      Interested Service
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white appearance-none"
                      style={{background: 'rgba(3,11,26,0.8)'}}
                    >
                      <option style={{background:'#050f2e'}}>Networking & Wi-Fi</option>
                      <option style={{background:'#050f2e'}}>Hardware Sales</option>
                      <option style={{background:'#050f2e'}}>CCTV Surveillance</option>
                      <option style={{background:'#050f2e'}}>Server Setup</option>
                      <option style={{background:'#050f2e'}}>AMC Support</option>
                      <option style={{background:'#050f2e'}}>Other Solutions</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-gray-300 mb-2"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="w-full px-4 py-3.5 rounded-xl border border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-500 resize-none"
                    style={{background: 'rgba(255,255,255,0.05)'}}
                    placeholder="Briefly describe your requirements..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 text-lg flex justify-center items-center gap-2 hover:scale-[1.02]"
                  style={{background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 30px rgba(59,130,246,0.4)'}}
                >
                  Send Request <ArrowRight size={20} />
                </button>

                {formStatus === 'success' && (
                  <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} /> Request received! We will contact
                    you shortly.
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-8" style={{background: 'rgba(2,8,18,0.97)', borderTop: '1px solid rgba(99,179,237,0.12)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <a href="#" className="flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                  <Cpu size={24} strokeWidth={2.5} />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  QCS Tech
                </span>
              </a>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Your trusted enterprise technology partner providing scalable
                infrastructure, robust security, and reliable hardware
                solutions globally.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all"
                >
                  <Globe size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:border-blue-400 hover:text-white transition-all"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-blue-800 hover:border-blue-800 hover:text-white transition-all"
                >
                  <Share2 size={18} />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">IT Services</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Server Infrastructure
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Networking & Wi-Fi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    CCTV Installation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Cybersecurity
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Hardware Procurement
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    IT Support & AMC
                  </a>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">
                Industry Solutions
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Corporate Offices
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Healthcare Facilities
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Educational Institutes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Retail Chains
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Manufacturing Units
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Subscribe to our newsletter for the latest tech insights and
                enterprise offers.
              </p>
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  alert('Subscribed successfully!')
                }}
              >
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 font-bold py-3 rounded-xl text-white hover:bg-blue-500 transition-colors flex justify-center items-center gap-2"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
            <div>
              &copy; {new Date().getFullYear()} QCS Tech Solutions. All rights
              reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

