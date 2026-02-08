'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Play, Phone, Code2, Mic, Target, Handshake, ImagePlus,
  UserPlus, Settings2, Rocket, Zap, Shield, Globe, Puzzle, BarChart3,
  HeartHandshake, ChevronDown, CheckCircle2, Star
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-xl border-surface-2' : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 overflow-hidden rounded-full border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            {/* Mascot Logo - Using Image with fallback or placeholder if file missing */}
            <img src="/neato-logo.svg" alt="Neato" className="object-cover w-full h-full" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">Neato Ventures</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <button className="hover:text-text-primary transition-colors flex items-center gap-1 group">
            Products <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
          </button>
          <Link href="#solutions" className="hover:text-text-primary transition-colors">Solutions</Link>
          <Link href="#testimonials" className="hover:text-text-primary transition-colors">Testimonials</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-text-primary hover:text-accent-blue transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="bg-accent-red hover:bg-red-500 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-accent-red/20 hover:-translate-y-0.5 transition-all">
            Start Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-bg-secondary border-b border-surface-2 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <Link href="#products" className="block text-lg font-bold text-text-primary">Products</Link>
              <Link href="#solutions" className="block text-lg font-bold text-text-primary">Solutions</Link>
              <Link href="#testimonials" className="block text-lg font-bold text-text-primary">Testimonials</Link>
              <div className="pt-6 border-t border-surface-2 grid grid-cols-2 gap-4">
                <Link href="/login" className="flex items-center justify-center py-3 rounded-lg bg-surface-2 text-text-primary font-bold">Sign In</Link>
                <Link href="/signup" className="flex items-center justify-center py-3 rounded-lg bg-accent-red text-white font-bold">Start Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center items-center pb-20 pt-[clamp(140px,20vh,240px)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-[#1A1A2E] to-[#2A1A3E] bg-[length:400%_400%] animate-aurora pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

      {/* Floating Orbs */}
      <motion.div style={{ y: y1 }} className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-accent-red/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-white/10 shadow-[0_0_40px_rgba(72,149,239,0.3)] mb-8 overflow-hidden bg-surface-1"
        >
          <img src="/neato-logo.svg" alt="Neato Mascot" className="w-full h-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1/60 backdrop-blur-md border border-white/10 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-state-success"></span>
          </span>
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">Now in Public Beta — 6 AI Products Live</span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8"
        >
          AI Tools That <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-red via-accent-blue to-accent-cyan animate-hue">Actually Work</span><br />
          For Your Business
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
        >
          From AI receptionists to image enhancement, Neato Ventures builds practical, production-ready AI products that solve real business problems — no PhD required.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <Link href="/signup" className="group h-12 px-8 rounded-lg bg-accent-red text-white font-bold flex items-center gap-2 hover:bg-red-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-red/25 transition-all">
            Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="h-12 px-8 rounded-lg bg-surface-1/50 border border-white/10 text-text-primary font-bold flex items-center gap-2 hover:bg-surface-2 hover:border-white/20 transition-all">
            <Play className="w-4 h-4 fill-current" /> Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-t border-white/5"
        >
          {[
            { label: 'AI Products', value: '6' },
            { label: 'Uptime SLA', value: '99.9%' },
            { label: 'API Calls/day', value: '10k+' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-bold text-2xl sm:text-3xl text-text-primary">{stat.value}</div>
              <div className="font-mono text-xs text-text-muted mt-1 uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent z-10" />
    </section>
  );
};

const Products = () => {
  const products = [
    { name: "Neato Receptionist", tagline: "Your AI front desk, always on.", desc: "Handle calls 24/7 with natural language AI. Route, transcribe, schedule — all without missing a beat.", icon: <Phone className="w-6 h-6 text-white" />, color: "bg-[#0D7377]", link: "#", badge: "Flagship" },
    { name: "AI Prompt Architect", tagline: "Craft perfect prompts, every time.", desc: "Design, test, and optimize AI prompts with our visual builder and analytics dashboard.", icon: <Code2 className="w-6 h-6 text-white" />, color: "bg-[#7C3AED]", link: "#" },
    { name: "Neato Type", tagline: "Voice to text, refined by AI.", desc: "Transcribe meetings, calls, and notes with speaker detection and smart formatting.", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-[#FF6B6B]", link: "#" },
    { name: "Neato Leads", tagline: "AI-powered lead intelligence.", desc: "Identify, score, and qualify leads automatically. Integrate with your CRM in minutes.", icon: <Target className="w-6 h-6 text-white" />, color: "bg-[#10B981]", link: "#" },
    { name: "AI Consulting", tagline: "Strategic AI Integration.", desc: "Expert guidance on AI adoption, custom model training, and workflow automation.", icon: <Handshake className="w-6 h-6 text-white" />, color: "bg-[#D4A843]", link: "#", badge: "Services" },
    { name: "Neato ClearPix", tagline: "Enhance any image with AI.", desc: "Upscale, restore, and enhance images with state-of-the-art neural processing.", icon: <ImagePlus className="w-6 h-6 text-white" />, color: "bg-[#EC4899]", link: "#" },
  ];

  return (
    <section id="products" className="py-24 sm:py-32 relative">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue font-mono text-xs font-bold mb-4 border border-accent-blue/20">Our Products</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-text-primary">Six Products. One Mission.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Each tool is purpose-built to solve a specific business challenge with practical AI — not hype.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative bg-surface-1 border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.15] hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${product.color}`} />

              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl ${product.color} flex items-center justify-center shadow-lg`}>
                  {product.icon}
                </div>
                {product.badge && (
                  <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-text-secondary">
                    {product.badge}
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-2xl text-text-primary mb-2">{product.name}</h3>
              <div className={`font-mono text-xs font-bold mb-4 opacity-80`} style={{ color: product.color.replace('bg-', '') }}>{product.tagline}</div>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">{product.desc}</p>

              <Link href={product.link} className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all" style={{ color: product.color.replace('bg-[', '').replace(']', '') }}>
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section className="py-24 relative bg-surface-1/30 border-y border-white/5">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
      <div className="mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-accent-cream/10 text-accent-cream font-mono text-xs font-bold mb-4 border border-accent-cream/20">How It Works</span>
        <h2 className="font-display font-bold text-4xl mb-4">Three Steps. Zero Friction.</h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Connection Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-surface-3 to-transparent" />

        {[
          { step: "01", title: "Sign Up", desc: "Create your account and choose from our suite of AI products. No technical setup required.", icon: <UserPlus className="w-8 h-8 text-accent-blue" />, color: "bg-accent-blue" },
          { step: "02", title: "Configure", desc: "Customize your AI tools to match your workflow. Integrate with your existing stack via API or native connectors.", icon: <Settings2 className="w-8 h-8 text-accent-gold" />, color: "bg-accent-gold" },
          { step: "03", title: "Launch", desc: "Deploy to production and watch your business metrics improve. Scale effortlessly as you grow.", icon: <Rocket className="w-8 h-8 text-accent-cyan" />, color: "bg-accent-cyan" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-surface-1 border border-surface-2 flex items-center justify-center mb-6 relative z-10 shadow-xl group hover:scale-105 transition-transform duration-300">
              <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full ${item.color} flex items-center justify-center font-mono text-xs font-bold text-bg-primary border-2 border-bg-primary`}>{item.step}</div>
              {item.icon}
            </div>
            <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-24 bg-bg-secondary/30">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold font-mono text-xs font-bold mb-4 border border-accent-gold/20">Why Neato</span>
        <h2 className="font-display font-bold text-4xl">Built Different. On Purpose.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Lightning Fast Setup", desc: "Deploy standard AI agents in under 5 minutes.", icon: <Zap className="w-5 h-5 text-accent-gold" /> },
          { title: "Enterprise Security", desc: "SOC 2 Type II compliant, AES-256 encryption.", icon: <Shield className="w-5 h-5 text-accent-blue" /> },
          { title: "Works Everywhere", desc: "Native integrations for Slack, Teams, and Web.", icon: <Globe className="w-5 h-5 text-accent-cyan" /> },
          { title: "Modular by Design", desc: "Mix and match products to build your perfect stack.", icon: <Puzzle className="w-5 h-5 text-product-prompt" /> },
          { title: "Built-in Analytics", desc: "Real-time insights on your AI usage and ROI.", icon: <BarChart3 className="w-5 h-5 text-product-leads" /> },
          { title: "Human-First AI", desc: "Designed to augment your team, not replace them.", icon: <HeartHandshake className="w-5 h-5 text-accent-red" /> },
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-1/50 hover:bg-surface-1 border border-white/5 rounded-2xl p-6 transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 rounded-lg bg-white/5">
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold text-lg">{feat.title}</h3>
            </div>
            <p className="text-text-secondary text-sm">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-white/5 flex justify-center">
        <div className="font-mono text-xs text-text-muted opacity-60 tracking-[0.2em] uppercase">React · TypeScript · Python · TensorFlow · AWS · Kubernetes</div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section id="testimonials" className="py-24">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="text-center mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-accent-cyan/10 text-accent-cyan font-mono text-xs font-bold mb-4 border border-accent-cyan/20">Testimonials</span>
        <h2 className="font-display font-bold text-4xl">Trusted by Teams Who Ship.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { quote: "Neato Receptionist handled 500 calls in our first week. It paid for itself in day one.", author: "Sarah Jenkins", role: "Ops Director", company: "Meridian Legal", product: "Receptionist" },
          { quote: "The API is incredibly stable. We integrated Neato Leads into our CRM and saw conversion double.", author: "Mike Ross", role: "CTO", company: "TechFlow Labs", product: "Leads" },
          { quote: "Finally, AI tools that don't feel like a science project. Polished, fast, and effective.", author: "Elena Wu", role: "Product Lead", company: "Apex Commerce", product: "Prompt Architect" }
        ].map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-surface-1/50 p-8 rounded-2xl border border-white/5"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-accent-gold fill-current" />)}
            </div>
            <p className="text-lg text-text-primary mb-6 leading-relaxed">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center font-bold text-xs">
                {t.author.charAt(0)}{t.author.split(' ')[1].charAt(0)}
              </div>
              <div>
                <div className="font-bold text-sm">{t.author}</div>
                <div className="text-xs text-text-muted">{t.role}, {t.company}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-surface-1/50 to-bg-primary" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />

    <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-full border-2 border-white/20 mx-auto mb-8 overflow-hidden shadow-[0_0_30px_rgba(240,180,41,0.2)]"
      >
        <img src="/neato-logo.svg" alt="Mascot" className="w-full h-full object-cover" />
      </motion.div>

      <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6">
        Ready to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue">Something Neato?</span>
      </h2>
      <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
        Join thousands of businesses using Neato Ventures to power their next-gen AI workflows.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/signup" className="h-14 px-8 rounded-full bg-accent-red text-white font-bold text-lg flex items-center gap-2 hover:bg-red-500 hover:scale-105 transition-all shadow-xl shadow-accent-red/20">
          Get Started Free <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/contact" className="h-14 px-8 rounded-full border border-surface-3 text-text-primary font-bold text-lg flex items-center hover:bg-surface-2 transition-all">
          Talk to Sales
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-text-muted">
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-state-success" /> Free 14-day trial</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-state-success" /> No credit card required</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-state-success" /> SOC 2 Compliant</span>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-surface-2 bg-bg-primary pt-20 pb-10">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src="/neato-logo.svg" alt="Neato" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl">Neato Ventures</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs mb-6">
            Building the operating system for the AI-native enterprise.
            Practical, powerful, and always neato.
          </p>
          <div className="flex gap-3">
            {/* Social placeholders */}
            {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-lg bg-surface-1 hover:bg-surface-2 transition-colors" />)}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Products</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-blue">Receptionist</a></li>
            <li><a href="#" className="hover:text-accent-blue">Prompt Architect</a></li>
            <li><a href="#" className="hover:text-accent-blue">Type</a></li>
            <li><a href="#" className="hover:text-accent-blue">Leads</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-blue">About</a></li>
            <li><a href="#" className="hover:text-accent-blue">Careers</a></li>
            <li><a href="#" className="hover:text-accent-blue">Blog</a></li>
            <li><a href="#" className="hover:text-accent-blue">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent-blue">Privacy</a></li>
            <li><a href="#" className="hover:text-accent-blue">Terms</a></li>
            <li><a href="#" className="hover:text-accent-blue">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-surface-2 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-muted font-mono">© 2026 Neato Ventures Inc. All rights reserved.</p>
        <div className="group flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors cursor-default">
          Made with AI & a little retro magic
          <img src="/neato-logo.svg" className="w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12" />
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body selection:bg-accent-blue/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Products />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
