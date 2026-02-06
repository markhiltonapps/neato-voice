
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vault-navy text-vault-paper font-sans overflow-x-hidden selection:bg-atom-green selection:text-vault-navy">
      {/* Navbar */}
      <nav className="border-b border-vault-olive/30 bg-vault-navy/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-mono font-bold text-atom-green text-glow tracking-tighter">
                NEATO<span className="text-vault-paper">VOICE</span>
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 font-mono text-sm">
                <a href="#features" className="hover:text-atom-amber transition-colors">MODULES</a>
                <a href="#pricing" className="hover:text-atom-amber transition-colors">REQ_ACCESS</a>
                <a href="#about" className="hover:text-atom-amber transition-colors">ABOUT</a>
                <Link href="/login" className="text-atom-teal hover:text-atom-green transition-colors border border-atom-teal hover:border-atom-green px-4 py-1 rounded-sm">
                  INITIALIZE_SESSION
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-scanline pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block border border-vault-olive/50 bg-vault-olive/10 px-3 py-1 rounded-full text-xs font-mono text-atom-amber mb-6 animate-pulse">
            SYSTEM V.2.0.77 ONLINE
          </div>
          <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-8">
            THE FUTURE OF BUSINESS<br />
            <span className="text-atom-green text-glow">AI LOOKS NEATO</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-vault-dust">
            Enterprise-grade intelligence for the modern industrial age. Automate, analyze, and execute with precision.
          </p>
          <div className="mt-10 flex justify-center gap-6">
            <Link href="/signup" className="px-8 py-4 bg-atom-green text-vault-navy font-bold font-mono text-lg rounded-sm hover:bg-atom-green/90 shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all transform hover:scale-105">
              START_FREE_TRIAL()
            </Link>
            <Link href="/login" className="px-8 py-4 border border-vault-paper text-vault-paper font-bold font-mono text-lg rounded-sm hover:border-atom-amber hover:text-atom-amber transition-all">
              LOGIN
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-vault-olive/30 pt-10">
            <div>
              <div className="text-4xl font-mono font-bold text-atom-green">24/7</div>
              <div className="text-sm font-mono text-vault-dust uppercase mt-1">AI Coverage</div>
            </div>
            <div>
              <div className="text-4xl font-mono font-bold text-vault-paper">50M+</div>
              <div className="text-sm font-mono text-vault-dust uppercase mt-1">Data Points</div>
            </div>
            <div>
              <div className="text-4xl font-mono font-bold text-atom-green">10x</div>
              <div className="text-sm font-mono text-vault-dust uppercase mt-1">Velocity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-vault-metal relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-mono font-bold text-atom-amber text-glow mb-4">ACCESS PLANS</h2>
            <p className="text-vault-dust">Select your clearance level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-vault-charcoal border border-vault-olive p-8 rounded-lg relative hover:border-atom-green transition-colors group">
              <h3 className="text-xl font-mono font-bold text-vault-paper mb-2">INITIATE</h3>
              <div className="text-4xl font-mono font-bold text-atom-green mb-6">$0<span className="text-lg text-vault-dust">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm text-vault-dust font-mono">
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> 15 Minutes Transcription</li>
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Basic Refinement</li>
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Fallout Style UI</li>
              </ul>
              <Link href="/signup" className="block w-full text-center py-3 border border-atom-green text-atom-green font-mono font-bold hover:bg-atom-green hover:text-vault-navy transition-colors">
                BEGIN_TRIAL
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-vault-charcoal border-2 border-atom-green p-8 rounded-lg relative shadow-[0_0_30px_rgba(57,255,20,0.15)] transform scale-105">
              <div className="absolute top-0 right-0 bg-atom-green text-vault-navy text-xs font-bold font-mono px-3 py-1">RECOMMENDED</div>
              <h3 className="text-xl font-mono font-bold text-atom-green mb-2 text-glow">OPERATOR</h3>
              <div className="text-4xl font-mono font-bold text-atom-green mb-6">$20<span className="text-lg text-vault-dust">/mo</span></div>
              <ul className="space-y-4 mb-8 text-sm text-vault-paper font-mono">
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Unlimited Transcription</li>
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Advanced AI Refinement</li>
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Priority Support</li>
                <li className="flex items-center"><span className="text-atom-green mr-2">✓</span> Admin Dashboard</li>
              </ul>
              <Link href="/signup?plan=pro" className="block w-full text-center py-3 bg-atom-green text-vault-navy font-mono font-bold hover:bg-atom-green/80 transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)]">
                UPGRADE_ACCESS
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-vault-charcoal border border-vault-olive p-8 rounded-lg relative hover:border-atom-amber transition-colors group">
              <h3 className="text-xl font-mono font-bold text-vault-paper mb-2">OVERSEER</h3>
              <div className="text-4xl font-mono font-bold text-atom-amber mb-6">CUSTOM</div>
              <ul className="space-y-4 mb-8 text-sm text-vault-dust font-mono">
                <li className="flex items-center"><span className="text-atom-amber mr-2">✓</span> On-Premise Deployment</li>
                <li className="flex items-center"><span className="text-atom-amber mr-2">✓</span> Custom Fine-tuning</li>
                <li className="flex items-center"><span className="text-atom-amber mr-2">✓</span> API Access</li>
              </ul>
              <Link href="mailto:sales@neatoventures.com" className="block w-full text-center py-3 border border-atom-amber text-atom-amber font-mono font-bold hover:bg-atom-amber hover:text-vault-navy transition-colors">
                CONTACT_SALES
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vault-navy border-t border-vault-olive/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-vault-dust font-mono text-sm">
          <p className="mb-4">NEATO VENTURES // EST. 2026</p>
          <p>© ALL RIGHTS RESERVED. UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.</p>
        </div>
      </footer>
    </div>
  );
}
