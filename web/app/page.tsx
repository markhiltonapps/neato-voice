'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, Play, Mic, Wand2, Laptop, Shield, Zap,
  CheckCircle2, Star, Download, ChevronDown, Menu, X
} from 'lucide-react';

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    // Simulate/Trigger download
    const link = document.createElement('a');
    link.href = '/neato-logo.svg'; // Placeholder for actual installer
    link.download = 'NeatoVoiceInstaller.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Redirect to onboarding
    router.push('/signup');
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-bg-primary/80 backdrop-blur-xl border-surface-2' : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 overflow-hidden rounded-full border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            <img src="/neato-logo.svg" alt="Neato Voice" className="object-cover w-full h-full" />
          </div>
          <span className="font-display font-bold text-lg text-text-primary tracking-tight">Neato Voice</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-text-primary transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-text-primary hover:text-accent-blue transition-colors">
            Sign In
          </Link>
          <button
            onClick={handleDownload}
            className="bg-accent-blue hover:bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-accent-blue/20 hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download
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
            className="md:hidden bg-bg-secondary border-b border-surface-2 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <Link href="#features" className="block text-lg font-bold text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>Features</Link>
              <Link href="#how-it-works" className="block text-lg font-bold text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>How it Works</Link>
              <Link href="#pricing" className="block text-lg font-bold text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              <div className="pt-6 border-t border-surface-2 grid grid-cols-2 gap-4">
                <Link href="/login" className="flex items-center justify-center py-3 rounded-lg bg-surface-2 text-text-primary font-bold">Sign In</Link>
                <Link href="/download" className="flex items-center justify-center py-3 rounded-lg bg-accent-blue text-white font-bold">Download</Link>
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
  const router = useRouter();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/neato-logo.svg';
    link.download = 'NeatoVoiceInstaller.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    router.push('/signup');
  };

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
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wider">Neato Voice Desktop v1.0 Live</span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight mb-8"
        >
          Capture Your Thoughts.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green animate-hue">Refined by AI.</span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
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
            className="group h-12 px-8 rounded-lg bg-accent-blue text-white font-bold flex items-center gap-2 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-blue/25 transition-all"
          >
            <Download className="w-4 h-4" /> Download for Windows
          </button>
          <Link href="/signup" className="h-12 px-8 rounded-lg bg-surface-1/50 border border-white/10 text-text-primary font-bold flex items-center gap-2 hover:bg-surface-2 hover:border-white/20 transition-all">
            Start Free Trial
          </Link>
        </motion.div>

        {/* App Preview / Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative mx-auto max-w-4xl p-2 bg-surface-1/30 rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl"
        >
          <div className="bg-bg-secondary rounded-lg overflow-hidden relative p-8 sm:p-12">
            <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary to-surface-2 opacity-80" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left: Raw Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-accent-red/20 text-accent-red animate-pulse">
                    <Mic className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Raw Audio Input</span>
                </div>
                <div className="p-6 rounded-xl bg-surface-1/50 border border-white/5 text-text-secondary italic leading-relaxed text-sm sm:text-base">
                  "Um, okay, so... for next week, uh, I think I need to email the client about the new project, then we have that team sync on Tuesday at 10, and, uh, oh, I have to finish the slide deck for Friday."
                </div>
              </div>

              {/* Middle: Arrow (Hidden on mobile) */}
              <div className="hidden md:flex flex-col items-center justify-center">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-3 rounded-full bg-accent-blue/10 text-accent-blue"
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
                <span className="text-[10px] font-mono text-accent-blue mt-2 uppercase tracking-tighter">AI Refinement</span>
              </div>

              {/* Right: Refined Output */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-state-success/20 text-state-success">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Refined for Action</span>
                </div>
                <div className="p-6 rounded-xl bg-surface-hover/80 border border-accent-blue/20 text-text-primary shadow-[0_0_20px_rgba(72,149,239,0.1)]">
                  <ul className="space-y-3 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                      <span>Email client regarding project proposal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
                      <span>Team sync: Tuesday @ 10:00 AM</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-2 shrink-0" />
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
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent z-10" />
    </section>
  );
};

const Features = () => {
  const features = [
    { title: "Instant Transcription", desc: "Speak naturally and watch your words appear in real-time.", icon: <Mic className="w-6 h-6 text-white" />, color: "bg-accent-red" },
    { title: "AI Refinement", desc: "Our AI engine cleans up filler words, fixes grammar, and formats your text automatically.", icon: <Wand2 className="w-6 h-6 text-white" />, color: "bg-accent-blue" },
    { title: "Desktop Overlay", desc: "Always one click away. Record directly over any application without breaking flow.", icon: <Laptop className="w-6 h-6 text-white" />, color: "bg-accent-cyan" },
    { title: "Custom Vocabulary", desc: "Teach Neato Voice your specific jargon, acronyms, and names.", icon: <Zap className="w-6 h-6 text-white" />, color: "bg-accent-gold" },
    { title: "Secure & Private", desc: "Enterprise-grade encryption for your voice data and transcripts.", icon: <Shield className="w-6 h-6 text-white" />, color: "bg-product-consulting" },
    { title: "Cloud Sync", desc: "Access your refined notes from any device via the web dashboard.", icon: <CheckCircle2 className="w-6 h-6 text-white" />, color: "bg-product-leads" },
  ];

  return (
    <section id="features" className="py-24 sm:py-32 relative bg-bg-secondary/30">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue font-mono text-xs font-bold mb-4 border border-accent-blue/20">Features</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-text-primary">More Than Just Dictation.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">A complete voice workflow designed for professionals who value speed and clarity.</p>
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
              className="group relative bg-surface-1 border border-white/[0.06] rounded-2xl p-8 hover:border-white/[0.15] hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${feature.color}`} />

              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shadow-lg mb-6`}>
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
  <section id="how-it-works" className="py-24 relative bg-surface-1/30 border-y border-white/5">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
      <div className="mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-accent-cream/10 text-accent-cream font-mono text-xs font-bold mb-4 border border-accent-cream/20">Workflow</span>
        <h2 className="font-display font-bold text-4xl mb-4">From Voice to Value in Seconds.</h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-surface-3 to-transparent" />

        {[
          { step: "01", title: "Record", desc: "Press the global hotkey and start speaking naturally. No need to pause or over-enunciate.", icon: <Mic className="w-8 h-8 text-accent-red" />, color: "bg-surface-2 border-accent-red" },
          { step: "02", title: "Refine", desc: "Our AI instantly processes your audio, restructuring it into clear, concise text.", icon: <Wand2 className="w-8 h-8 text-accent-blue" />, color: "bg-surface-2 border-accent-blue" },
          { step: "03", title: "Action", desc: "Paste the result directly into Email, Slack, or Docs. Or save it to your dashboard.", icon: <CheckCircle2 className="w-8 h-8 text-accent-green" />, color: "bg-surface-2 border-accent-green" }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="relative flex flex-col items-center"
          >
            <div className={`w-24 h-24 rounded-2xl bg-surface-1 border-2 flex items-center justify-center mb-6 relative z-10 shadow-xl ${item.color.split(' ')[1]}`}>
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

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async (tier: 'free' | 'pro') => {
    if (tier === 'free') {
      router.push('/signup');
    } else {
      // Prompt for email before checkout
      const email = prompt('Please enter your email address to continue:');

      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      setLoading(true);
      try {
        // Create Stripe guest checkout session
        const response = await fetch('/api/stripe/checkout-guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            billingPeriod,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create checkout session');
        }

        // Redirect to Stripe Checkout
        if (data.url) {
          window.location.href = data.url;
        }
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
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold font-mono text-xs font-bold mb-4 border border-accent-gold/20">Pricing</span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4 text-text-primary">Simple, Transparent Pricing.</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">Start free. Upgrade when you're ready.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-full p-1.5">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${billingPeriod === 'monthly' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 flex items-center gap-2 ${billingPeriod === 'annual' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Annual
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-gold/20 text-accent-gold font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* FREE Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group relative bg-surface-1/50 backdrop-blur-sm border border-surface-2 rounded-2xl p-8 hover:border-white/20 hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-2">Free</h3>
                <p className="text-text-muted text-sm">Perfect for trying out Neato Voice</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-5xl text-text-primary">$0</span>
                  <span className="text-text-muted text-sm">/month</span>
                </div>
                <p className="text-xs text-text-muted mt-2">Up to 1,000 words per month</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  '1,000 words/month',
                  'Real-time transcription',
                  'AI-powered refinement',
                  'Desktop overlay',
                  'Cloud sync',
                  'Basic support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe('free')}
                className="w-full py-3 rounded-lg bg-surface-2 hover:bg-surface-3 border border-surface-3 hover:border-white/20 text-text-primary font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* PRO Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative bg-gradient-to-br from-accent-blue/10 to-accent-cyan/5 backdrop-blur-sm border-2 border-accent-blue/30 rounded-2xl p-8 hover:border-accent-blue/50 hover:shadow-[0_20px_60px_-15px_rgba(72,149,239,0.3)] transition-all duration-300 overflow-hidden"
          >
            {/* Popular Badge */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-accent-blue to-accent-cyan text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg rounded-tr-2xl shadow-lg">
              Most Popular
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="mb-6 mt-4">
                <h3 className="font-display font-bold text-2xl text-text-primary mb-2">Pro</h3>
                <p className="text-text-muted text-sm">For power users who dictate daily</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-5xl bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent">
                    ${billingPeriod === 'monthly' ? monthlyPrice.toFixed(2) : annualPrice.toFixed(2)}
                  </span>
                  <span className="text-text-muted text-sm">/month</span>
                </div>
                {billingPeriod === 'annual' && (
                  <p className="text-xs text-accent-gold mt-2 flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-accent-gold" />
                    Save $24/year with annual billing
                  </p>
                )}
                {billingPeriod === 'monthly' && (
                  <p className="text-xs text-text-muted mt-2">Unlimited words per month</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited words',
                  'Real-time transcription',
                  'AI-powered refinement',
                  'Desktop overlay',
                  'Cloud sync',
                  'Priority support',
                  'Custom vocabulary',
                  'Advanced analytics'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                    <CheckCircle2 className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe('pro')}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-blue to-accent-cyan hover:shadow-[0_10px_30px_-5px_rgba(72,149,239,0.4)] text-white font-bold transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-lg shadow-accent-blue/25 hover:-translate-y-0.5"
              >
                Start Pro Trial
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-xs text-text-muted mt-3">No credit card required for trial</p>
            </div>
          </motion.div>
        </div>

        {/* Trust Signal */}
        <div className="text-center mt-12">
          <p className="text-text-muted text-sm flex items-center justify-center gap-2 flex-wrap">
            <CheckCircle2 className="w-4 h-4 text-state-success" />
            <span>Cancel anytime</span>
            <span className="mx-2 text-surface-3">•</span>
            <CheckCircle2 className="w-4 h-4 text-state-success" />
            <span>30-day money-back guarantee</span>
            <span className="mx-2 text-surface-3">•</span>
            <CheckCircle2 className="w-4 h-4 text-state-success" />
            <span>Secure payment via Stripe</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => (
  <section id="testimonials" className="py-24">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl">Loved by Productive Humans.</h2>
      </div>
      {/* Simple testimonial row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-surface-1/50 p-8 rounded-2xl border border-white/5">
          <p className="text-lg text-text-primary mb-4">"Neato Voice has completely replaced typing for my first drafts. It's shockingly accurate."</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center font-bold text-accent-blue">JD</div>
            <div>
              <div className="font-bold text-sm">James Doe</div>
              <div className="text-xs text-text-muted">Product Manager</div>
            </div>
          </div>
        </div>
        <div className="bg-surface-1/50 p-8 rounded-2xl border border-white/5">
          <p className="text-lg text-text-primary mb-4">"The AI refinement is the killer feature. It turns my ramblings into professional emails instantly."</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-red/20 flex items-center justify-center font-bold text-accent-red">AS</div>
            <div>
              <div className="font-bold text-sm">Anna Smith</div>
              <div className="text-xs text-text-muted">Marketing Director</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CTA = () => {
  const router = useRouter();
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const link = document.createElement('a');
    link.href = '/neato-logo.svg';
    link.download = 'NeatoVoiceInstaller.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    router.push('/signup');
  };

  return (
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
          Stop Typing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-red to-accent-blue">Start Speaking.</span>
        </h2>
        <p className="text-xl text-text-secondary mb-10 max-w-xl mx-auto">
          Download Neato Voice today and experience the future of dictation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleDownload}
            className="h-14 px-8 rounded-full bg-accent-blue text-white font-bold text-lg flex items-center gap-2 hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-accent-blue/20"
          >
            <Download className="w-5 h-5" /> Download for Windows
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
  <footer className="border-t border-surface-2 bg-bg-primary pt-20 pb-10">
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img src="/neato-logo.svg" alt="Neato" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl">Neato Voice</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs">
            The AI voice recorder for professionals.
          </p>
        </div>

        <div className="flex gap-8 text-sm text-text-secondary font-medium">
          <Link href="/privacy" className="hover:text-text-primary">Privacy</Link>
          <Link href="/terms" className="hover:text-text-primary">Terms</Link>
          <Link href="mailto:support@neatoventures.com" className="hover:text-text-primary">Support</Link>
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
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
