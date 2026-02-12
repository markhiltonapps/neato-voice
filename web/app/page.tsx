'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Play, Mic, Wand2, Laptop, Shield, Zap,
  CheckCircle2, Star, Download, ChevronDown, Menu, X,
  Radio, Atom
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled
        ? 'bg-bg-primary/90 backdrop-blur-xl border-white/10'
        : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-retro-cream transition-transform duration-700 group-hover:rotate-180">
            <Atom className="w-8 h-8" strokeWidth={2} />
          </div>
          <span className="font-mono font-bold text-lg sm:text-xl text-text-primary tracking-[0.15em] uppercase">NEATO_VENTURES</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold font-mono tracking-wide text-text-secondary">
          <Link href="/" className="hover:text-retro-yellow transition-colors uppercase">HOME</Link>
          <Link href="#features" className="hover:text-retro-yellow transition-colors uppercase">ABOUT</Link>
          <Link href="#how-it-works" className="hover:text-retro-yellow transition-colors uppercase">PRODUCTS</Link>
          <Link href="#pricing" className="hover:text-retro-yellow transition-colors uppercase">CONTACT</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={handleDownload}
            className="bg-retro-orange hover:bg-retro-red text-white text-sm font-bold px-6 py-2.5 rounded shadow-[4px_4px_0px_0px_rgba(86,39,23,0.5)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(86,39,23,0.5)] transition-all flex items-center gap-2 border border-white/10 font-mono tracking-wide"
          >
            GET STARTED
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-bg-secondary border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 font-mono uppercase">
              <Link href="#features" className="block text-lg font-bold text-text-primary hover:text-retro-yellow" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link>
              <Link href="#how-it-works" className="block text-lg font-bold text-text-primary hover:text-retro-yellow" onClick={() => setIsMobileMenuOpen(false)}>PRODUCTS</Link>
              <Link href="#pricing" className="block text-lg font-bold text-text-primary hover:text-retro-yellow" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link>
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 gap-4">
                <Link href="#pricing" className="flex items-center justify-center py-3 rounded bg-retro-red text-white font-bold shadow-[2px_2px_0px_0px_black]">GET STARTED</Link>
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

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <section className="relative min-h-[100vh] flex flex-col justify-center items-center pb-20 pt-[clamp(140px,20vh,240px)] overflow-hidden retro-grain">
      {/* Background Effects - Solar Strip Theme */}
      <div className="absolute inset-0 bg-bg-primary z-0" />

      {/* Solar Stripes */}
      <div className="absolute top-0 left-0 right-0 h-[400px] opacity-20 pointer-events-none overflow-hidden select-none">
        <div className="w-[150%] h-[100px] bg-retro-cream -rotate-3 translate-x-[-10%] translate-y-[-50px] blur-3xl rounded-full" />
        <div className="w-[150%] h-[100px] bg-retro-yellow -rotate-3 translate-x-[-10%] translate-y-[-20px] blur-3xl rounded-full" />
        <div className="w-[150%] h-[100px] bg-retro-orange -rotate-3 translate-x-[-10%] translate-y-[10px] blur-3xl rounded-full" />
        <div className="w-[150%] h-[100px] bg-retro-red -rotate-3 translate-x-[-10%] translate-y-[40px] blur-3xl rounded-full" />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

      {/* Floating Orbs (Muted Retro Style) */}
      <motion.div style={{ y: y1 }} className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-retro-yellow/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 right-[10%] w-[600px] h-[600px] bg-retro-red/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Content */}
      <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="mx-auto w-32 h-32 text-retro-red mb-8 flex items-center justify-center p-4"
        >
          <Atom className="w-full h-full animate-[spin_10s_linear_infinite]" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-retro-yellow/20 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-retro-yellow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-retro-yellow"></span>
          </span>
          <span className="font-mono text-xs text-retro-cream uppercase tracking-widest font-bold">Neato Voice Desktop v1.0 Live</span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.0] tracking-tight mb-8 text-retro-cream drop-shadow-lg"
        >
          Capture Your Thoughts.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-retro-yellow via-retro-orange to-retro-red">Refined by AI.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
        >
          Neato Voice instantly turns your spoken words into structured, polished text. No more "umms", "ahhs", or rambling notes. Just perfect clarity.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button
            onClick={handleDownload}
            className="group h-14 px-8 rounded bg-retro-red text-white font-bold font-mono tracking-wide flex items-center gap-2 hover:bg-retro-orange hover:-translate-y-1 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] border-2 border-transparent"
          >
            <Download className="w-5 h-5" /> DOWNLOAD FOR WINDOWS
          </button>
          <Link href="/signup" className="h-14 px-8 rounded bg-transparent border-2 border-text-secondary/30 text-text-primary font-bold font-mono tracking-wide flex items-center gap-2 hover:border-retro-yellow hover:text-retro-yellow transition-all">
            START FREE TRIAL
          </Link>
        </motion.div>

        {/* App Preview / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative mx-auto max-w-4xl p-2 bg-surface-1/50 rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl"
        >
          <div className="bg-bg-secondary rounded-lg overflow-hidden relative p-8 sm:p-12 border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-surface-1 to-bg-primary opacity-90" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Raw Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-retro-red/20 text-retro-red border border-retro-red/30">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-retro-red uppercase tracking-widest font-bold">Raw Audio Input</span>
                </div>
                <div className="p-6 rounded bg-black/20 border-l-2 border-retro-red/50 text-text-secondary italic leading-relaxed text-sm sm:text-base font-mono">
                  "Um, okay, so... for next week, uh, I think I need to email the client about the new project, then we have that team sync on Tuesday at 10, and, uh, oh, I have to finish the slide deck for Friday."
                </div>
              </div>

              {/* Middle: Arrow (Hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center justify-center">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-3 rounded-full bg-retro-yellow/10 text-retro-yellow"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
                <span className="text-[10px] font-mono text-retro-yellow mt-2 uppercase tracking-tighter">AI Refinement</span>
              </div>

              {/* Right: Refined Output */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-state-success/20 text-state-success border border-state-success/30">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-state-success uppercase tracking-widest font-bold">Refined for Action</span>
                </div>
                <div className="p-6 rounded bg-surface-2 border-l-2 border-state-success/50 text-text-primary shadow-lg">
                  <ul className="space-y-3 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-retro-yellow mt-2 shrink-0" />
                      <span>Email client regarding project proposal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-retro-yellow mt-2 shrink-0" />
                      <span>Team sync: Tuesday @ 10:00 AM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-retro-yellow mt-2 shrink-0" />
                      <span>Complete slide deck by Friday</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-secondary to-transparent z-10" />
    </section>
  );
};

const Features = () => {
  const features = [
    { title: "Instant Transcription", desc: "Speak naturally and watch your words appear in real-time.", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-retro-red" },
    { title: "AI Refinement", desc: "Our AI engine cleans up filler words, fixes grammar, and formats your text automatically.", icon: <Wand2 className="w-6 h-6 text-bg-primary" />, color: "bg-retro-yellow text-bg-primary" },
    { title: "Desktop Overlay", desc: "Always one click away. Record directly over any application without breaking flow.", icon: <Laptop className="w-6 h-6 text-white" />, color: "bg-retro-orange" },
    { title: "Custom Vocabulary", desc: "Teach Neato Voice your specific jargon, acronyms, and names.", icon: <Zap className="w-6 h-6 text-white" />, color: "bg-retro-brown" },
    { title: "Secure & Private", desc: "Enterprise-grade encryption for your voice data and transcripts.", icon: <Shield className="w-6 h-6 text-white" />, color: "bg-accent-blue" },
    { title: "Cloud Sync", desc: "Access your refined notes from any device via the web dashboard.", icon: <CheckCircle2 className="w-6 h-6 text-bg-primary" />, color: "bg-retro-cream text-bg-primary" },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative bg-bg-secondary retro-grain border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded bg-retro-yellow/10 text-retro-yellow font-mono text-xs font-bold mb-4 border border-retro-yellow/20 uppercase tracking-widest">Features</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-text-primary">More Than Just Dictation.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto font-mono">A complete voice workflow designed for professionals who value speed and clarity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative bg-surface-1 border border-white/[0.06] rounded p-8 hover:border-retro-orange/50 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${feature.color.split(' ')[0]}`} />
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`w-12 h-12 rounded ${feature.color} flex items-center justify-center shadow-lg mb-6 border border-white/10`}>
                {feature.icon}
              </div>

              <h3 className="font-display font-bold text-xl text-text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative bg-bg-primary border-y border-white/5 retro-grain">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
      <div className="mb-16">
        <span className="inline-block px-3 py-1 rounded bg-retro-cream/10 text-retro-cream font-mono text-xs font-bold mb-4 border border-retro-cream/20 uppercase tracking-widest">Workflow</span>
        <h2 className="font-display font-bold text-4xl mb-4">From Voice to Value.</h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-retro-yellow to-transparent opacity-30" />

        {[
          { step: "01", title: "Record", desc: "Press the global hotkey and start speaking naturally. No need to pause or over-enunciate.", icon: <Mic className="w-8 h-8 text-retro-red" />, color: "bg-surface-2 border-retro-red" },
          { step: "02", title: "Refine", desc: "Our AI instantly processes your audio, restructuring it into clear, concise text.", icon: <Wand2 className="w-8 h-8 text-retro-orange" />, color: "bg-surface-2 border-retro-orange" },
          { step: "03", title: "Action", desc: "Paste the result directly into Email, Slack, or Docs. Or save it to your dashboard.", icon: <CheckCircle2 className="w-8 h-8 text-retro-yellow" />, color: "bg-surface-2 border-retro-yellow" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative flex flex-col items-center"
          >
            <div className={`w-24 h-24 rounded-full bg-bg-secondary border-2 flex items-center justify-center mb-6 relative z-10 shadow-xl ${item.color.split(' ')[1]}`}>
              {item.icon}
            </div>
            <h3 className="font-display font-bold text-xl mb-3 text-retro-cream">{item.title}</h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs font-mono">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (tier: 'free' | 'pro') => {
    if (tier === 'free') {
      router.push('/signup');
    } else {
      const email = prompt('Please enter your email address to continue:');
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('/api/stripe/checkout-guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, billingPeriod }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');
        if (data.url) window.location.href = data.url;
      } catch (error: any) {
        console.error('Checkout error:', error);
        alert('Failed to start checkout. Please try again.');
        setLoading(false);
      }
    }
  };

  const monthlyPrice = 9.99;
  const annualPrice = 7.99; // 20% off

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-bg-secondary retro-grain">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-retro-orange/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded bg-retro-gold/10 text-retro-cream font-mono text-xs font-bold mb-4 border border-retro-cream/20 uppercase tracking-widest">Pricing</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-text-primary">Simple, Transparent Pricing.</h2>

          <div className="inline-flex items-center gap-3 bg-surface-1 border-2 border-retro-cream/10 rounded-full p-2 mt-8 relative z-20 mx-auto shadow-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-200 ${billingPeriod === 'monthly' ? 'bg-retro-red text-white shadow-md' : 'text-text-secondary hover:text-retro-cream'}`}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 ${billingPeriod === 'annual' ? 'bg-retro-red text-white shadow-md' : 'text-text-secondary hover:text-retro-cream'}`}
            >
              ANNUAL
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-retro-yellow text-bg-primary font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* FREE Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group relative bg-surface-1 border border-white/5 rounded-xl p-8 hover:border-retro-cream/20 hover:shadow-2xl transition-all duration-300"
          >
            <div className="mb-6">
              <h3 className="font-display font-bold text-2xl text-text-primary mb-2">Free</h3>
              <p className="text-text-muted text-sm font-mono">Perfect for trying out Neato Voice</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-5xl text-text-primary">$0</span>
                <span className="text-text-muted text-sm font-bold">/MO</span>
              </div>
              <p className="text-xs text-text-muted mt-2 font-mono">Up to 1,000 words per month</p>
            </div>
            <ul className="space-y-3 mb-8">
              {['1,000 words/month', 'Real-time transcription', 'AI-powered refinement', 'Desktop overlay', 'Cloud sync'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckCircle2 className="w-5 h-5 text-retro-cream shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe('free')} className="w-full py-3 rounded bg-surface-2 hover:bg-surface-3 border border-white/10 hover:border-white/20 text-text-primary font-bold transition-all duration-200 uppercase tracking-widest shadow-md">
              Get Started Free
            </button>
          </motion.div>

          {/* PRO Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-surface-1 border-2 border-retro-orange/30 rounded-xl p-8 hover:border-retro-orange hover:shadow-[0_20px_60px_-15px_rgba(231,98,25,0.3)] transition-all duration-300"
          >
            <div className="absolute top-0 right-0 bg-retro-orange text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-lg">
              Most Popular
            </div>
            <div className="mb-6 mt-4">
              <h3 className="font-display font-bold text-2xl text-retro-orange mb-2">Pro</h3>
              <p className="text-text-muted text-sm font-mono">For power users who dictate daily</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-5xl text-retro-cream">
                  ${billingPeriod === 'monthly' ? monthlyPrice.toFixed(2) : annualPrice.toFixed(2)}
                </span>
                <span className="text-text-muted text-sm font-bold">/MO</span>
              </div>
              {billingPeriod === 'monthly' && <p className="text-xs text-text-muted mt-2 font-mono">Unlimited words per month</p>}
            </div>
            <ul className="space-y-3 mb-8">
              {['Unlimited words', 'Real-time transcription', 'AI-powered refinement', 'Desktop overlay', 'Cloud sync', 'Priority support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                  <CheckCircle2 className="w-5 h-5 text-retro-orange shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe('pro')} className="w-full py-3 rounded bg-retro-orange hover:bg-retro-red text-white font-bold transition-all duration-200 uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 group/btn">
              Start Pro Trial <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
            <p className="text-center text-xs text-text-muted mt-3 font-mono">No credit card required for trial</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section id="testimonials" className="py-24 bg-bg-primary retro-grain">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl">Trusted by Productive Humans.</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { text: "Neato Voice has completely replaced typing for my first drafts. It's shockingly accurate.", author: "James Doe", role: "Product Manager", initials: "JD", bg: "bg-retro-blue/20" },
          { text: "The AI refinement is the killer feature. It turns my ramblings into professional emails instantly.", author: "Anna Smith", role: "Marketing Director", initials: "AS", bg: "bg-retro-red/20" }
        ].map((item, i) => (
          <div key={i} className="bg-surface-1 p-8 rounded border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 text-retro-yellow fill-retro-yellow" />)}
            </div>
            <p className="text-lg text-text-primary mb-6 font-medium">"{item.text}"</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center font-bold text-text-primary border border-white/10`}>{item.initials}</div>
              <div>
                <div className="font-bold text-sm text-retro-cream">{item.author}</div>
                <div className="text-xs text-text-muted font-mono">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => {
  const router = useRouter();
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const pricingSection = document.querySelector('#pricing');
    if (pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="py-32 relative overflow-hidden bg-bg-secondary retro-grain">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:40px_40px] opacity-10" />

      <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mx-auto mb-8 opacity-50"
        >
          <img src="/neato-logo.svg" alt="Mascot" className="w-full h-full" onError={(e) => e.currentTarget.style.display = 'none'} />
          <Radio className="w-full h-full text-retro-orange" />
        </motion.div>

        <h2 className="font-display font-bold text-4xl sm:text-5xl mb-6 text-retro-cream">
          Stop Typing. <span className="text-retro-red">Start Speaking.</span>
        </h2>
        <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto font-mono">
          Download Neato Voice today and experience the future of dictation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDownload}
            className="h-16 px-10 rounded bg-retro-red text-white font-bold text-lg flex items-center gap-2 hover:bg-retro-orange hover:scale-105 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] border-2 border-transparent"
          >
            <Download className="w-6 h-6" /> DOWNLOAD FOR WINDOWS
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs font-mono text-text-muted">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-state-success" /> Windows 10/11</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-state-success" /> Free Trial Available</span>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 bg-bg-secondary pt-20 pb-10 retro-grain">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <span className="font-display font-bold text-2xl text-retro-cream tracking-tighter">NEATO_VENTURES</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs font-mono">
            The AI voice recorder for professionals.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-text-secondary font-bold font-mono uppercase tracking-wide">
          <Link href="/privacy" className="hover:text-retro-yellow">Privacy</Link>
          <Link href="/terms" className="hover:text-retro-yellow">Terms</Link>
          <Link href="mailto:support@neatoventures.com" className="hover:text-retro-yellow">Support</Link>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-muted font-mono">© 2026 Neato Ventures Inc. All rights reserved.</p>
        <div className="group flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition-colors cursor-default font-mono">
          Made with AI & a little retro magic
        </div>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-body selection:bg-retro-orange/30 selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
