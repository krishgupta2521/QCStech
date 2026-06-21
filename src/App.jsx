import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowRight,
  Award,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  Globe,
  Handshake,
  HardHat,
  HeartPulse,
  Hotel,
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
} from "lucide-react";

// --- Custom Hooks ---

// Hook for scroll reveal animations
const useIntersectionObserver = (options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isIntersecting];
};

// --- Reusable Components ---

const Reveal = ({
  children,
  className = "",
  delay = 0,
  from = "up",
  distance = 60,
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px",
  });

  const getTransform = () => {
    if (isVisible) return "translate(0,0) scale(1) rotateX(0deg)";
    switch (from) {
      case "left":
        return `translate(-${distance}px, 0) scale(0.95)`;
      case "right":
        return `translate(${distance}px, 0) scale(0.95)`;
      case "scale":
        return "translate(0, 20px) scale(0.85)";
      case "flip":
        return "translate(0, 30px) rotateX(20deg) scale(0.95)";
      default:
        return `translate(0, ${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};

const Counter = ({ target, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// Pre-computed particle data — stable across re-renders
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  width: `${Math.random() * 4 + 2}px`,
  height: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background:
    i % 3 === 0
      ? "rgba(14,165,233,0.5)"
      : i % 3 === 1
        ? "rgba(34,211,238,0.4)"
        : "rgba(100,116,139,0.3)",
  animationDuration: `${Math.random() * 10 + 8}s`,
  animationDelay: `${Math.random() * 8}s`,
}));

// --- Main App Component ---

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const fd = new FormData(event.target);
    setPendingFormData({
      formEl: event.target,
      name: fd.get("name") || "",
      company: fd.get("company") || "",
      email: fd.get("email") || "",
      service: fd.get("service") || "",
      message: fd.get("message") || "",
    });
    setShowEmailModal(true);
  };

  const buildEmailParts = () => {
    if (!pendingFormData) return { subject: "", body: "" };
    const { name, company, email, service, message } = pendingFormData;
    const subject = `Enquiry from ${name} — ${service}`;
    const body = [
      `Name: ${name}`,
      company ? `Company: ${company}` : "",
      `Email: ${email}`,
      `Service: ${service}`,
      "",
      `Message:`,
      message,
    ]
      .filter((l) => l !== null)
      .join("\n");
    return { subject, body };
  };

  const sendViaOutlook = () => {
    const { subject, body } = buildEmailParts();
    const mailto = `mailto:ashish@qcstech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_self");
    finishSend();
  };

  const sendViaGmail = () => {
    const { subject, body } = buildEmailParts();
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=ashish@qcstech.in&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
    finishSend();
  };

  const finishSend = () => {
    setShowEmailModal(false);
    setFormStatus("success");
    if (pendingFormData?.formEl) pendingFormData.formEl.reset();
    setPendingFormData(null);
    setTimeout(() => setFormStatus(""), 3000);
  };

  return (
    <div
      className="font-sans text-gray-900 antialiased selection:bg-[#0ea5e9] selection:text-white"
      style={{ background: "#f0f7ff" }}
    >
      {/* â"€â"€ SCROLL PROGRESS BAR â"€â"€ */}
      <div
        className="fixed top-0 left-0 z-[100] h-[3px] transition-all duration-100"
        style={{
          width: `${scrollProgress}%`,
          background: "linear-gradient(90deg, #0ea5e9, #22d3ee, #0ea5e9)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
          boxShadow:
            "0 0 12px rgba(14,165,233,0.9), 0 0 24px rgba(34,211,238,0.6)",
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

        /* â"€â"€ AURORA BACKGROUND â"€â"€ */
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
          0%,100% { opacity: 0.03; transform: scale(1) rotate(0deg); }
          50%     { opacity: 0.06; transform: scale(1.05) rotate(1deg); }
        }

        /* â"€â"€ ANIMATIONS â"€â"€ */
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
          0%   { box-shadow: 0 0 0 0 rgba(14,165,233,0.5); }
          70%  { box-shadow: 0 0 0 18px rgba(14,165,233,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,211,238,0); }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 20px rgba(99,102,105,0.35), 0 0 60px rgba(34,211,238,0.15); }
          50%     { box-shadow: 0 0 50px rgba(99,102,105,0.7), 0 0 100px rgba(34,211,238,0.4); }
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
          0%,100% { border-color: rgba(14,165,233,0.25); }
          33%     { border-color: rgba(34,211,238,0.35); }
          66%     { border-color: rgba(100,92,125,0.35); }
        }
        @keyframes float-y {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-18px); }
        }
        @keyframes glow-text {
          0%,100% { text-shadow: 0 0 20px rgba(14,165,233,0.45), 0 0 40px rgba(100,116,139,0.35); }
          50%     { text-shadow: 0 0 40px rgba(14,165,233,0.8), 0 0 80px rgba(34,211,238,0.5); }
        }

        /* â"€â"€ UTILITY CLASSES â"€â"€ */
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
          background: rgba(14,165,233,0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(14,165,233,0.18);
        }
        .glass-panel-light {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(14,165,233,0.12);
          box-shadow: 0 8px 32px rgba(14,165,233,0.08);
        }
        .site-surface { background: transparent; }

        .dark-card {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(14,165,233,0.15);
          box-shadow: 0 4px 24px rgba(14,165,233,0.07), 0 1px 3px rgba(0,0,0,0.05);
          transition: border-color 0.4s, box-shadow 0.4s, transform 0.3s;
        }
        .dark-card:hover {
          border-color: rgba(14,165,233,0.35);
          box-shadow: 0 12px 40px rgba(14,165,233,0.14), 0 4px 12px rgba(0,0,0,0.06);
        }

        .gradient-text {
          background: linear-gradient(135deg, #0284c7, #0ea5e9, #22d3ee, #0ea5e9, #0284c7);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        .section-divider { border-top: 1px solid rgba(14,165,233,0.1); }

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
          background: linear-gradient(90deg, transparent, rgba(14,165,233,0.7), rgba(34,211,238,0.7), transparent);
          animation: scan-line 3.5s linear infinite;
          z-index: 5; pointer-events: none;
        }
        .border-animate { animation: border-dance 4s ease-in-out infinite; }

        /* Stars layer */
        .stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 40% 70%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 55% 20%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 10% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 70% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 15% 55%, rgba(255,255,255,0.2) 0%, transparent 100%),
            radial-gradient(1px 1px at 85% 85%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 45% 45%, rgba(255,255,255,0.3) 0%, transparent 100%);
          animation: stars-drift 60s linear infinite;
        }
      `,
        }}
      />

      {/* â"€â"€ AURORA BACKGROUND â"€â"€ */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Light base */}
        <div
          className="absolute inset-0"
          style={{ background: "#f0f7ff" }}
        ></div>

        {/* Aurora blob 1 */}
        <div
          className="absolute animate-aurora1"
          style={{
            width: "90vw",
            height: "90vh",
            top: "-20%",
            left: "-20%",
            background:
              "radial-gradient(ellipse, rgba(14,165,233,0.12) 0%, rgba(186,230,255,0.06) 35%, transparent 70%)",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
            filter: "blur(60px)",
          }}
        />
        {/* Aurora blob 2 */}
        <div
          className="absolute animate-aurora2"
          style={{
            width: "80vw",
            height: "80vh",
            top: "10%",
            right: "-25%",
            background:
              "radial-gradient(ellipse, rgba(34,211,238,0.1) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)",
            borderRadius: "40% 60% 30% 70% / 60% 40% 60% 40%",
            filter: "blur(70px)",
          }}
        />
        {/* Aurora blob 3 */}
        <div
          className="absolute animate-aurora3"
          style={{
            width: "70vw",
            height: "70vh",
            bottom: "-10%",
            left: "20%",
            background:
              "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, rgba(14,165,233,0.04) 40%, transparent 70%)",
            borderRadius: "50% 50% 40% 60% / 40% 60% 50% 50%",
            filter: "blur(80px)",
          }}
        />
        {/* Aurora blob 4 */}
        <div
          className="absolute animate-aurora1 animation-delay-4000"
          style={{
            width: "60vw",
            height: "60vh",
            top: "40%",
            left: "40%",
            background:
              "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            filter: "blur(90px)",
          }}
        />
        {/* Aurora blob 5 */}
        <div
          className="absolute animate-aurora2 animation-delay-2000"
          style={{
            width: "50vw",
            height: "50vh",
            bottom: "15%",
            right: "10%",
            background:
              "radial-gradient(ellipse, rgba(14,165,233,0.07) 0%, transparent 65%)",
            borderRadius: "50%",
            filter: "blur(75px)",
          }}
        />

        {/* Grid mesh overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0 34L0 84V52l28 16 28-16v32L28 100z' fill='none' stroke='rgba(14,165,233,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: "56px 100px",
            animation: "mesh-shift 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? "py-3" : "bg-transparent py-4"
        }`}
        style={{
          top: "28px",
          ...(isScrolled
            ? {
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(14,165,233,0.12)",
                boxShadow: "0 4px 24px rgba(14,165,233,0.08)",
              }
            : {}),
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="#" className="flex items-center gap-2 group">
                <span className="font-bold text-xl tracking-tight text-gray-900">
                  QCS Tech
                </span>
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {["Services", "Solutions", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                  boxShadow: "0 0 20px rgba(14,165,233,0.4)",
                }}
              >
                Get Quote
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="focus:outline-none text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-sky-200 absolute w-full left-0 top-full shadow-xl">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {["Services", "Solutions", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md"
                >
                  {item}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 mt-4 text-center font-medium bg-sky-500 text-white rounded-md hover:bg-sky-500"
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
        style={{
          top: "3px",
          height: "28px",
          background: "rgba(240,247,255,0.98)",
          borderBottom: "1px solid rgba(14,165,233,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            animation: "ticker 35s linear infinite",
            whiteSpace: "nowrap",
            alignItems: "center",
            height: "100%",
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        style={{ paddingTop: "120px" }}
      >
        {/* Abstract Background Shapes */}
        <div
          className="absolute inset-0 w-full h-full opacity-10"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.02\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#1e1b4b] rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left pt-10 lg:pt-0">
              <Reveal from="left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sky-400 text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                  </span>
                  Enterprise Grade Solutions
                </div>
              </Reveal>
              <Reveal delay={100} from="left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                  Transforming Businesses Through{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-400 to-cyan-300">
                    Smart IT Solutions
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={200} from="left">
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
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
                    style={{
                      background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                      boxShadow: "0 0 30px rgba(14,165,233,0.35)",
                    }}
                  >
                    Get Free Consultation <ArrowRight size={18} />
                  </a>
                  <a
                    href="#services"
                    className="px-8 py-4 rounded-lg glass-panel text-white font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2 border-animate"
                  >
                    Explore Services
                  </a>
                </div>
              </Reveal>

              {/* Trust Indicators */}
              <Reveal delay={400} from="left">
                <div className="relative z-10 mt-12 pt-6 border-t border-sky-200 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                 <div className="flex items-center gap-2 text-gray-600 shrink-0 whitespace-nowrap">
  <CheckCircle2 size={18} className="text-sky-500" /> Best In the Industry
</div>
<div className="flex items-center gap-2 text-gray-600 shrink-0 whitespace-nowrap">
  <CheckCircle2 size={18} className="text-sky-500" /> 24/7 Support
</div>
<div className="flex items-center gap-2 text-gray-600 shrink-0 whitespace-nowrap">
  <CheckCircle2 size={18} className="text-sky-500" /> 9+ Years Exp
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
                <div className="relative w-48 h-64 bg-white/80 backdrop-blur rounded-xl border border-sky-200 flex flex-col items-center justify-evenly p-4 z-20 shadow-2xl shadow-sky-200/60">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="w-full h-12 bg-sky-50 rounded border border-sky-200 flex items-center px-3 gap-2"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item === 3
                            ? "bg-red-500"
                            : "bg-green-500 animate-pulse"
                        }`}
                      ></div>
                      <div className="w-2 h-2 rounded-full bg-sky-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                      <div className="flex-1"></div>
                      <div className="w-16 h-1 bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Orbiting Elements */}
                <div className="absolute w-80 h-80 border border-[#0ea5e9]/40 rounded-full animate-[spin_20s_linear_infinite]">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded border border-sky-300 shadow-md flex items-center justify-center text-sky-500">
                    <Network size={16} />
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded border border-sky-300 shadow-md flex items-center justify-center text-sky-500">
                    <Shield size={16} />
                  </div>
                </div>

                <div className="absolute w-96 h-96 border border-[#0ea5e9]/20 rounded-full animate-[spin_30s_linear_infinite_reverse]">
                  <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 bg-white rounded border border-cyan-300 shadow-md flex items-center justify-center text-cyan-500">
                    <Server size={16} />
                  </div>
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 bg-white rounded border border-sky-300 shadow-md flex items-center justify-center text-sky-500">
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
                    stroke="#22d3ee"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 200,200 L 50,300"
                    stroke="#5b537a"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 200,200 L 350,300"
                    stroke="#8e85ab"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-transparent relative z-10 -mt-10 section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom">
            <div className="dark-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-4">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={9} />
                </div>
                <div className="text-xs font-semibold text-sky-500/80 uppercase tracking-widest">
                  Years Experience
                </div>
              </div>
              <div className="p-4 border-l border-sky-200">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={500} suffix="+" />
                </div>
                <div className="text-xs font-semibold text-sky-500/80 uppercase tracking-widest">
                  Projects Delivered
                </div>
              </div>
              <div className="p-4 md:border-l border-sky-200">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  <Counter target={350} suffix="+" />
                </div>
                <div className="text-xs font-semibold text-sky-500/80 uppercase tracking-widest">
                  Enterprise Clients
                </div>
              </div>
              <div className="p-4 border-l border-sky-200">
                <div className="text-4xl font-extrabold gradient-text mb-2">
                  24/7
                </div>
                <div className="text-xs font-semibold text-sky-500/80 uppercase tracking-widest">
                  Support Available
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brands Marquee */}
      <div className="relative z-10 py-14 overflow-hidden section-divider" style={{ background: "rgba(14,165,233,0.03)", borderTop: "1px solid rgba(14,165,233,0.1)", borderBottom: "1px solid rgba(14,165,233,0.1)" }}>
        <p className="text-center text-xs font-semibold tracking-[0.22em] uppercase text-sky-500/70 mb-10">Brands We Deal In</p>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #edf5ff, transparent)" }} />
          <div className="absolute right-0 top-0 h-full w-40 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #edf5ff, transparent)" }} />
          <div className="flex animate-[marquee_40s_linear_infinite] w-max">
            {[
              { name: "Dell",       slug: "dell",           color: "#0076CE" },
              { name: "HP",         slug: "hp",             color: "#0096D6" },
              { name: "Lenovo",     slug: "lenovo",         color: "#E2231A" },
              { name: "Acer",       slug: "acer",           color: "#83B81A" },
              { name: "Samsung",    slug: "samsung",        color: "#1428A0" },
              { name: "Microsoft",  slug: "microsoft",      color: "#737373" },
              { name: "Epson",      slug: "epson",          color: "#003087" },
              { name: "WD",         slug: "westerndigital", color: "#E35205" },
              { name: "Seagate",    slug: "seagate",        color: "#00A67C" },
              { name: "Hikvision",  slug: "hikvision",      color: "#C8102E" },
              { name: "Honeywell",  slug: "honeywell",      color: "#E2231A" },
              { name: "Zebronics",  slug: null,             color: "#f59e0b" },
              { name: "Yealink",    slug: null,             color: "#00A651" },
              { name: "CP Plus",    slug: null,             color: "#D22B2B" },
              { name: "Brio",       slug: null,             color: "#0ea5e9" },
              { name: "Oscoo",      slug: null,  color: "#0ea5e9" },
              { name: "Kingston",   slug: null,  color: "#C8102E" },
              { name: "Kensington", slug: null,  color: "#D4373B" },
              // duplicate for seamless loop
              { name: "Dell",       slug: "dell",           color: "#0076CE" },
              { name: "HP",         slug: "hp",             color: "#0096D6" },
              { name: "Lenovo",     slug: "lenovo",         color: "#E2231A" },
              { name: "Acer",       slug: "acer",           color: "#83B81A" },
              { name: "Samsung",    slug: "samsung",        color: "#1428A0" },
              { name: "Microsoft",  slug: "microsoft",      color: "#737373" },
              { name: "Epson",      slug: "epson",          color: "#003087" },
              { name: "WD",         slug: "westerndigital", color: "#E35205" },
              { name: "Seagate",    slug: "seagate",        color: "#00A67C" },
              { name: "Hikvision",  slug: "hikvision",      color: "#C8102E" },
              { name: "Honeywell",  slug: "honeywell",      color: "#E2231A" },
              { name: "Zebronics",  slug: null,             color: "#f59e0b" },
              { name: "Yealink",    slug: null,             color: "#00A651" },
              { name: "CP Plus",    slug: null,             color: "#D22B2B" },
              { name: "Brio",       slug: null,             color: "#0ea5e9" },
              { name: "Oscoo",      slug: null,  color: "#0ea5e9" },
              { name: "Kingston",   slug: null,  color: "#C8102E" },
              { name: "Kensington", slug: null,  color: "#D4373B" },
            ].map((brand, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-3 mx-8 shrink-0 w-32">
                {brand.slug ? (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      border: `1px solid ${brand.color}30`,
                      boxShadow: `0 4px 16px ${brand.color}18`,
                    }}
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color.replace('#', '')}`}
                      alt={brand.name}
                      width="52"
                      height="52"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
                    style={{
                      background: `${brand.color}10`,
                      border: `1px solid ${brand.color}35`,
                      boxShadow: `0 4px 16px ${brand.color}18`,
                    }}
                  >
                    <span className="text-sm font-extrabold text-center leading-tight px-2" style={{ color: brand.color }}>
                      {brand.name}
                    </span>
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-500 tracking-wide text-center whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section
        id="about"
        className="py-24 bg-transparent overflow-hidden section-divider"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Aesthetic Visual Area */}
            <Reveal from="left" className="relative">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/15 to-cyan-500/15 rounded-[2.5rem] transform rotate-3 blur-2xl opacity-60"></div>

              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group">
                  <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                    alt="Futuristic Technology Abstract"
                    className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700"
                  />

                  {/* Overlay Gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent z-10"></div>
                </div>

                {/* Floating Widget 1: Security */}
                <div
                  className="absolute -right-6 top-10 dark-card p-4 rounded-2xl flex items-center gap-4 animate-bounce z-20"
                  style={{ animationDuration: "4s" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Lock size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">
                      Enterprise Security
                    </div>
                    <div className="text-xs text-sky-500 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                      Active Protection
                    </div>
                  </div>
                </div>

                {/* Floating Widget 2: Uptime */}
                <div
                  className="absolute -left-8 bottom-12 dark-card p-4 rounded-2xl flex items-center gap-4 animate-bounce z-20"
                  style={{ animationDuration: "3.5s", animationDelay: "1s" }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#483c6c] to-sky-500 rounded-full flex items-center justify-center text-white shadow-inner">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">
                      System Uptime
                    </div>
                    <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-500">
                      99.99%
                    </div>
                  </div>
                </div>

                {/* Floating Widget 3: Award */}
                <div className="absolute right-12 -bottom-6 dark-card p-3 px-5 rounded-full flex items-center gap-3 z-20">
                  <Award size={18} className="text-amber-400" />
                  <span className="font-bold text-slate-800 text-sm">
                    Top Tech Partner
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} from="right">
              <span className="text-sky-400 font-bold tracking-wider uppercase text-sm">
                About Our Company
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                Empowering Business With{" "}
                <span className="gradient-text">Future-Ready</span> Tech.
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                We don't just supply hardware; we architect resilient, highly
                scalable IT ecosystems. From complex server deployments to
                advanced cybersecurity protocols and smart office automation, we
                act as your definitive technology partner.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-700 font-medium pt-1">
                    Enterprise-grade hardware procurement & data center setup.
                  </span>
                </li>
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-700 font-medium pt-1">
                    Robust network architecture and seamless Wi-Fi deployment.
                  </span>
                </li>
                <li className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="ml-4 text-gray-700 font-medium pt-1">
                    Advanced AI-driven CCTV surveillance & access control systems.
                  </span>
                </li>
              </ul>

              <span className="text-sky-400 font-bold tracking-wider uppercase text-xs block mb-3">
                Why Choose Us
              </span>
              <div className="space-y-3 mb-10">
                {[
                  { icon: <UserCheck size={18} />, title: "Certified Experts", desc: "Certified network engineers, server engineers, and hardware specialists." },
                  { icon: <Clock size={18} />, title: "Rapid Response Times", desc: "Strict SLAs ensuring minimal downtime with prompt on-site and remote support." },
                  { icon: <Handshake size={18} />, title: "Vendor Neutral", desc: "Best hardware and software combinations tailored to your needs." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start dark-card p-4 rounded-xl transition-all hover:scale-[1.01]">
                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-slate-800 text-sm">{item.title}</div>
                      <div className="text-gray-600 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white transition-all duration-300 gap-2 group hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                  boxShadow: "0 0 30px rgba(14,165,233,0.30)",
                }}
              >
                Discover Our Approach{" "}
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
      <section id="services" className="py-24 bg-transparent section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom" className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#22d3ee] font-bold tracking-wider uppercase text-sm">
              Core Expertise
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              Comprehensive IT Services
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              We deliver scalable, secure, and high-performance technology
              solutions tailored to your operational demands.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Cards Data Array */}
            {[
              {
                img: "/gettyimages-1198069792-612x612.jpg",
                color: "slate-qua",
                title: "CCTV Installation",
                desc: "Professional installation of HD & IP cameras, NVR/DVR setups, remote mobile monitoring, and complete surveillance systems for homes, offices, and shops.",
              },
              {
                img: "/computer hardware.png",
                color: "slate-ter",
                title: "IT Hardware",
                desc: "We sell laptops, desktops, workstations, switches, Storage at fair prices.",
              },
              {
                img: "/sell laptop.jpg",
                color: "slate-five",
                title: "Computer Accessories",
                desc: "We provide a wide range of computer accessories including monitors, keyboards, mice, printers, and networking peripherals to enhance your IT setup.",
              },
              {
                img: "/server and databse.jpg",
                color: "slate",
                title: "Server & Datacenter",
                desc: "End-to-end server rack installation, configuration, virtualization, and maintenance for optimal data management.",
              },
              {
                img: "/networking.jpg",
                color: "slate-sec",
                title: "Networking & Wi-Fi",
                desc: "Enterprise-grade structured cabling, switches, routers, and high-density Wi-Fi deployment for seamless connectivity.",
              },
              {
                img: "/amc support.webp",
                color: "slate-six",
                title: "AMC & IT Support",
                desc: "Comprehensive Annual Maintenance Contracts (AMC) providing proactive monitoring, troubleshooting, and fast resolution.",
              },
              {
                img: "/gettyimages-1198069792-612x612.jpg",
                color: "slate-qua",
                title: "IT Asset & Management",
                desc: "We provide end to end IT Asset Management services, including device procurement, deployment, tracking, maintenance, and recovery. Our asset management solutions ensure seamless onboarding, improved asset visibility, reduced operational overhead.",
              },
              {
                img: "/gettyimages-1198069792-612x612.jpg",
                color: "slate-sec",
                title: "Cloud & Architecture",
                desc: "We deliver cloud solutions, including cloud migration, infrastructure management, security, monitoring, and disaster recovery. Our services enable businesses to leverage scalable, reliable, and cost-effective cloud platforms while maintaining operational efficiency and data security.",
              },
            ].map((service, index) => {
              // Updated slate/grey aesthetic mapping
              const colorMap = {
                slate:
                  "bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-white",
                "slate-sec":
                  "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white",
                "slate-ter":
                  "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white",
                "slate-qua":
                  "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-400 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white",
                "slate-five":
                  "bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-400 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-white",
                "slate-six":
                  "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500 group-hover:text-white",
                textHover: {
                  slate: "group-hover:text-indigo-300",
                  "slate-sec": "group-hover:text-cyan-300",
                  "slate-ter": "group-hover:text-fuchsia-300",
                  "slate-qua": "group-hover:text-emerald-300",
                  "slate-five": "group-hover:text-amber-300",
                  "slate-six": "group-hover:text-rose-300",
                },
              };

              return (
                <Reveal
                  key={service.title}
                  delay={index * 100}
                  from={index % 2 === 0 ? "left" : "right"}
                >
                  <div className="dark-card rounded-2xl p-8 transition-all duration-300 group h-full flex flex-col relative overflow-hidden hover:scale-[1.03]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-500/5 to-transparent rounded-bl-full -z-10 transition-all duration-300 group-hover:scale-150 group-hover:opacity-50"></div>

                    <div className="w-16 h-16 rounded-xl mb-6 overflow-hidden shadow-sm border border-white/60">
                      <img
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3
                      className={`text-xl font-bold text-slate-800 mb-3 transition-colors ${
                        colorMap.textHover[service.color]
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-8 flex-grow">
                      {service.desc}
                    </p>
                    <a
                      href="#contact"
                      className={`font-semibold inline-flex items-center group/link mt-auto text-sky-400 hover:text-sky-300`}
                    >
                      Learn More{" "}
                      <ArrowRight
                        size={16}
                        className="ml-2 transform group-hover/link:translate-x-1 transition-transform"
                      />
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Particles Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={p} />
        ))}
      </div>

      {/* Solutions Showcase */}
      <section
        id="solutions"
        className="py-24 text-gray-900 overflow-hidden relative section-divider"
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-100/40 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-sky-100/30 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal
            from="bottom"
            className="flex flex-col md:flex-row justify-between items-end mb-14"
          >
            <div className="max-w-2xl">
              <span className="text-sky-400 font-bold tracking-wider uppercase text-sm">
                Targeted Solutions
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
                Built For Your Industry
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                We design customized technology frameworks that address the
                unique challenges of different business environments.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <a
                href="#"
                className="text-gray-700 border border-sky-300 hover:border-sky-500 hover:text-sky-600 px-6 py-3 rounded-full transition-all duration-300 font-medium block text-center hover:shadow-lg hover:shadow-sky-200/50"
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
                title: "Corporate Offices",
                desc: "Complete office setup including networking, employee workstations, biometric access, and secure Wi-Fi.",
                img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
                color: "from-sky-500 to-blue-600",
              },
              {
                icon: <GraduationCap size={26} />,
                title: "Educational Institutes",
                desc: "Smart classroom setups, campus-wide managed Wi-Fi, computer labs, and digital PA systems.",
                img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
                color: "from-cyan-500 to-teal-600",
              },
              {
                icon: <Store size={26} />,
                title: "Retail Chains",
                desc: "POS hardware, extensive CCTV coverage, inventory scanning, and reliable network backbones for retail stores.",
                img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
                color: "from-cyan-500 to-pink-600",
              },
              {
                icon: <HardHat size={26} />,
                title: "Builders & Construction",
                desc: "Rugged site networking, IP cameras for site monitoring, access control, and project management connectivity.",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
                color: "from-amber-500 to-orange-600",
              },
              {
                icon: <HeartPulse size={26} />,
                title: "Healthcare Facilities",
                desc: "HIPAA-compliant networking, nurse call systems, patient monitoring, and secure data management for hospitals and clinics.",
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
                color: "from-rose-500 to-red-600",
              },
              {
                icon: <Hotel size={26} />,
                title: "Hospitality & Hotels",
                desc: "High-density guest Wi-Fi, in-room entertainment systems, property management networks, and smart room automation.",
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
                color: "from-sky-500 to-purple-600",
              },
              {
                icon: <ShoppingCart size={26} />,
                title: "Warehousing & Logistics",
                desc: "Barcode scanning infrastructure, warehouse-wide networking, GPS tracking integration, and inventory CCTV systems.",
                img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600",
                color: "from-emerald-500 to-green-600",
              },
              // Duplicate set for seamless infinite loop
              {
                icon: <Building2 size={26} />,
                title: "Corporate Offices",
                desc: "Complete office setup including networking, employee workstations, biometric access, and secure Wi-Fi.",
                img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
                color: "from-sky-500 to-blue-600",
              },
              {
                icon: <GraduationCap size={26} />,
                title: "Educational Institutes",
                desc: "Smart classroom setups, campus-wide managed Wi-Fi, computer labs, and digital PA systems.",
                img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600",
                color: "from-cyan-500 to-teal-600",
              },
              {
                icon: <Store size={26} />,
                title: "Retail Chains",
                desc: "POS hardware, extensive CCTV coverage, inventory scanning, and reliable network backbones for retail stores.",
                img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
                color: "from-cyan-500 to-pink-600",
              },
              {
                icon: <HardHat size={26} />,
                title: "Builders & Construction",
                desc: "Rugged site networking, IP cameras for site monitoring, access control, and project management connectivity.",
                img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
                color: "from-amber-500 to-orange-600",
              },
              {
                icon: <HeartPulse size={26} />,
                title: "Healthcare Facilities",
                desc: "HIPAA-compliant networking, nurse call systems, patient monitoring, and secure data management for hospitals and clinics.",
                img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
                color: "from-rose-500 to-red-600",
              },
              {
                icon: <Hotel size={26} />,
                title: "Hospitality & Hotels",
                desc: "High-density guest Wi-Fi, in-room entertainment systems, property management networks, and smart room automation.",
                img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
                color: "from-sky-500 to-purple-600",
              },
              {
                icon: <ShoppingCart size={26} />,
                title: "Warehousing & Logistics",
                desc: "Barcode scanning infrastructure, warehouse-wide networking, GPS tracking integration, and inventory CCTV systems.",
                img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=600",
                color: "from-emerald-500 to-green-600",
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 border-animate"
                style={{
                  width: "340px",
                  height: "420px",
                  border: "1px solid rgba(14,165,233,0.15)",
                }}
              >
                {/* Scan line effect */}
                <div className="scan-line opacity-0 group-hover:opacity-100"></div>

                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                {/* Top gradient accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                ></div>

                <div className="absolute inset-0 p-7 flex flex-col justify-end transform transition-transform duration-300 group-hover:-translate-y-2">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-5 shadow-lg pulse-ring`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-400 delay-75 leading-relaxed">
                    {card.desc}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                    <span className="inline-flex items-center gap-1.5 text-sky-400 text-sm font-semibold">
                      Learn More{" "}
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
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
                width: i === 0 ? "24px" : "6px",
                height: "6px",
                background:
                  i === 0
                    ? "linear-gradient(90deg, #0ea5e9, #22d3ee)"
                    : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-transparent relative section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal from="bottom" className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#22d3ee] font-bold tracking-wider uppercase text-sm">
              How We Work
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900">
              Seamless Execution Process
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              A structured approach to guarantee zero downtime and perfectly
              aligned technology implementations.
            </p>
          </Reveal>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div
              className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-0.5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(14,165,233,0.3), rgba(34,211,238,0.3), rgba(100,92,125,0.3), transparent)",
              }}
            ></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Consultation",
                  desc: "Assessing your current infrastructure and understanding business requirements.",
                },
                {
                  step: "2",
                  title: "Design & Plan",
                  desc: "Architecting secure networks, selecting hardware, and creating blueprints.",
                  highlight: true,
                },
                {
                  step: "3",
                  title: "Implementation",
                  desc: "Expert installation, configuration, and integration by certified engineers.",
                },
                {
                  step: "4",
                  title: "Support & AMC",
                  desc: "Rigorous testing followed by ongoing 24/7 maintenance and monitoring.",
                },
              ].map((item, idx) => (
                <Reveal
                  key={item.title}
                  delay={idx * 150}
                  from={idx % 2 === 0 ? "left" : "right"}
                  className="relative text-center dark-card md:bg-transparent p-6 rounded-2xl md:border-none mb-4 md:mb-0"
                >
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-6 relative z-10 transition-transform hover:scale-110 ${
                      item.highlight
                        ? "border-4 border-sky-400/40 text-white shadow-xl shadow-sky-500/40"
                        : "border-4 border-white/5 text-gray-300 shadow-lg"
                    }`}
                    style={
                      item.highlight
                        ? {
                            background:
                              "linear-gradient(135deg, #0284c7, #0ea5e9)",
                          }
                        : { background: "rgba(14,165,233,0.05)" }
                    }
                  >
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative py-24 bg-slate-900 overflow-hidden"
        style={{ background: "#13121b" }}
      >
        {/* Background Patterns */}
        <div
          className="absolute inset-0 w-full h-full opacity-5 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        ></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-25"></div>
        <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-sky-600 rounded-full mix-blend-multiply filter blur-[80px] opacity-25"></div>

        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Ready to Upgrade Your <br className="hidden md:block" /> IT
            Infrastructure?
          </h2>
          <p className="text-xl text-sky-300 mb-10 max-w-2xl mx-auto">
            Partner with experts to build secure, scalable, and future-ready
            technology solutions tailored for your enterprise.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <a
              href="#contact"
              className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all shadow-xl shadow-gray-900/20 text-lg"
            >
              Request a Custom Quote
            </a>
            <a
              href="tel:+919899536532"
              className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-md text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 border border-white/20 text-lg"
            >
              <Phone size={20} /> Call Experts Now
            </a>
          </div>
        </Reveal>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-24 bg-transparent relative section-divider"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <Reveal from="left">
              <span className="text-sky-400 font-bold tracking-wider uppercase text-sm">
                Get In Touch
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
                Let's Discuss Your Tech Needs
              </h2>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Whether you need a complete office setup, network security
                audit, or hardware procurement, our experts are ready to
                architect your solution.
              </p>

              <div className="space-y-6">
                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-slate-800">
                      Office
                    </h4>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      C-148, New Moti Nagar,
                      <br />
                      New Delhi 110015
                    </p>
                  </div>
                </div>

                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-slate-800">Email Us</h4>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      ashish@qcstech.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start group dark-card p-4 rounded-2xl transition-all hover:scale-[1.01]">
                  <div className="flex-shrink-0 w-14 h-14 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 transition-colors">
                    <Phone size={24} />
                  </div>
                  <div className="ml-5">
                    <h4 className="text-lg font-bold text-slate-800">
                      Call Support (24/7)
                    </h4>
                    <p className="text-gray-600 mt-1 leading-relaxed">
                      +91 98995 36532
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
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      style={{ background: "white" }}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      style={{ background: "white" }}
                      placeholder="Your Company Ltd."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
                      style={{ background: "white" }}
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Interested Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-900 appearance-none"
                      style={{ background: "white" }}
                    >
                      <option>CCTV Installation</option>
                      <option>Computer Hardware & Accessories</option>
                      <option>Buy / Sell Laptops & PCs</option>
                      <option>Networking & Wi-Fi</option>
                      <option>Server Setup</option>
                      <option>AMC & IT Support</option>
                      <option>IT Hardware Asset Management</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
                    style={{ background: "white" }}
                    placeholder="Briefly describe your requirements..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-bold py-4 rounded-xl transition-all duration-300 text-lg flex justify-center items-center gap-2 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                    boxShadow: "0 0 30px rgba(14,165,233,0.4)",
                  }}
                >
                  Send Request <ArrowRight size={20} />
                </button>

                {formStatus === "success" && (
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
      <footer
        className="pt-20 pb-8"
        style={{
          background: "rgba(240,247,255,0.98)",
          borderTop: "1px solid rgba(14,165,233,0.12)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <a href="#" className="flex items-center gap-2 mb-6 group">
                <span className="font-extrabold text-2xl tracking-tight text-gray-900">
                  QCS Tech
                </span>
              </a>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Your trusted enterprise technology partner providing scalable
                infrastructure, robust security, and reliable hardware solutions
                globally.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border border-sky-200 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all shadow-sm"
                >
                  <Globe size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border border-sky-200 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all shadow-sm"
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white border border-sky-200 flex items-center justify-center text-gray-500 hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all shadow-sm"
                >
                  <Share2 size={18} />
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-gray-900 font-bold mb-6 text-lg">IT Services</h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    CCTV Installation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Computer Hardware & Accessories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Buy & Sell Laptops/PCs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Networking & Wi-Fi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Server Infrastructure
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    IT Support & AMC
                  </a>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-gray-900 font-bold mb-6 text-lg">
                Industry Solutions
              </h4>
              <ul className="space-y-4 text-sm text-gray-600">
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Corporate Offices
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Healthcare Facilities
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Educational Institutes
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Retail Chains
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Manufacturing Units
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-gray-900 font-bold mb-6 text-lg">
                Stay Updated
              </h4>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Subscribe to our newsletter for the latest tech insights and
                enterprise offers.
              </p>
              <form
                className="flex flex-col gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  alert("Subscribed successfully!");
                }}
              >
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-sky-200 text-gray-900 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all placeholder-gray-400 shadow-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-sky-500 font-bold py-3 rounded-xl text-white hover:bg-sky-500 transition-colors flex justify-center items-center gap-2"
                >
                  Subscribe Now
                </button>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-sky-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
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

      {/* Email Client Selection Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl p-8 flex flex-col items-center"
            style={{
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(14,165,233,0.15)",
              boxShadow: "0 32px 80px rgba(14,165,233,0.12), 0 4px 24px rgba(0,0,0,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-7">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-400 mb-2">Send via</p>
              <h3 className="text-lg font-semibold text-gray-900">Choose a mail client</h3>
            </div>

            {/* Divider */}
            <div className="w-full h-px mb-7" style={{ background: "rgba(14,165,233,0.12)" }} />

            {/* Icon buttons */}
            <div className="flex items-center justify-center gap-8 mb-7">
              {/* Outlook */}
              <button
                onClick={sendViaOutlook}
                title="Open in Outlook / Mail App"
                className="group flex flex-col items-center gap-2.5"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(0,120,212,0.12)",
                    border: "1px solid rgba(0,120,212,0.25)",
                    boxShadow: "0 4px 20px rgba(0,120,212,0.15)",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                    <rect x="2" y="2" width="44" height="44" rx="10" fill="#0078D4"/>
                    <path d="M27 11h15v26H27V11z" fill="#50E6FF" opacity="0.35"/>
                    <path d="M6 14.5L26 10v28L6 33.5V14.5z" fill="white"/>
                    <ellipse cx="16" cy="24" rx="7" ry="8.5" fill="#0078D4"/>
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-800 transition-colors tracking-wide">Outlook</span>
              </button>

              {/* Separator */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-5" style={{ background: "rgba(14,165,233,0.15)" }}/>
                <span className="text-[10px] text-gray-400 font-medium">or</span>
                <div className="w-px h-5" style={{ background: "rgba(14,165,233,0.15)" }}/>
              </div>

              {/* Gmail */}
              <button
                onClick={sendViaGmail}
                title="Open in Gmail"
                className="group flex flex-col items-center gap-2.5"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                  style={{
                    background: "rgba(234,67,53,0.1)",
                    border: "1px solid rgba(234,67,53,0.2)",
                    boxShadow: "0 4px 20px rgba(234,67,53,0.12)",
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 48 48" fill="none">
                    <path d="M44 24.5c0-1.3-.1-2.6-.4-3.8H24v7.2h11.3c-.5 2.5-1.9 4.6-4 6v5h6.4C41.3 35.1 44 30.3 44 24.5z" fill="#4285F4"/>
                    <path d="M24 45c5.7 0 10.5-1.9 14-5.1l-6.4-5c-1.9 1.3-4.3 2-7.6 2-5.8 0-10.8-3.9-12.5-9.2H5v5.2C8.5 40.9 15.8 45 24 45z" fill="#34A853"/>
                    <path d="M11.5 27.7A12.5 12.5 0 0 1 11 24c0-1.3.2-2.5.5-3.7V15H5A20 20 0 0 0 4 24c0 3.2.8 6.3 2.1 9l5.4-5.3z" fill="#FBBC05"/>
                    <path d="M24 11.5c3.2 0 6.1 1.1 8.4 3.3l6.2-6.2C34.5 5 29.7 3 24 3 15.8 3 8.5 7.1 5 15l6.5 5c1.7-5.2 6.7-8.5 12.5-8.5z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-800 transition-colors tracking-wide">Gmail</span>
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-px mb-5" style={{ background: "rgba(14,165,233,0.12)" }} />

            <button
              onClick={() => setShowEmailModal(false)}
              className="text-[12px] font-medium text-gray-400 hover:text-gray-700 transition-colors tracking-wide"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/919899536532"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-[150] flex items-center justify-center w-[56px] h-[56px] rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{ background: "#25D366", boxShadow: "0 6px 28px rgba(37,211,102,0.5), 0 2px 8px rgba(0,0,0,0.25)" }}
      >
        {/* Red notification dot */}
        <span
          className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
          style={{ background: "#ef4444" }}
        />
        {/* Official WhatsApp icon mark */}
        <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M24 4C13 4 4 13 4 24c0 3.6.97 7 2.66 9.9L4 44l10.4-2.72A19.93 19.93 0 0 0 24 44c11 0 20-9 20-20S35 4 24 4z"
            fill="white"
          />
          <path
            d="M33.4 27.9c-.5-.25-2.9-1.43-3.35-1.6-.45-.16-.77-.24-1.1.25-.32.5-1.25 1.6-1.54 1.93-.28.33-.57.37-1.06.12-.5-.25-2.1-.77-4-2.46-1.48-1.32-2.48-2.95-2.77-3.45-.29-.5-.03-.77.22-1.02.22-.22.5-.57.74-.86.24-.28.32-.5.48-.83.16-.33.08-.62-.04-.87-.12-.25-1.1-2.66-1.51-3.64-.4-.96-.8-.83-1.1-.85-.28-.01-.6-.02-.93-.02-.32 0-.85.12-1.3.62-.44.5-1.7 1.66-1.7 4.05s1.74 4.7 1.98 5.02c.24.33 3.43 5.23 8.31 7.34 1.16.5 2.07.8 2.78 1.03 1.17.37 2.23.32 3.07.19.94-.14 2.9-1.18 3.31-2.32.41-1.14.41-2.12.29-2.33-.12-.2-.45-.32-.95-.57z"
            fill="#25D366"
          />
        </svg>
      </a>
    </div>
  );
}
