import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  CONTRACT_ADDRESS, 
  GECKOTERMINAL_URL, 
  TWITTER_URL, 
  DEXSCREENER_EMBED_URL, 
  MASCOT_IMAGE, 
  MEME_IMAGES, 
  ROADMAP_ITEMS, 
  BUY_STEPS, 
  EXCUSE_DATABASE, 
  PHYSICAL_WARNINGS, 
  QUIZ_QUESTIONS, 
  FUNNY_TESTIMONIALS 
} from './data';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  text: string;
}

export default function App() {
  // General states
  const [copied, setCopied] = useState(false);
  const [puffCounter, setPuffCounter] = useState(() => {
    const saved = localStorage.getItem('cig_puff_counter');
    return saved ? parseInt(saved, 10) : 42;
  });
  
  // Custom excuse generator states
  const [currentExcuse, setCurrentExcuse] = useState("Click pull for a solid excuse to light up instantly.");
  const [excuseLoading, setExcuseLoading] = useState(false);

  // Quiz states
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Active floating particles for smoke simulation
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);
  const particleIdRef = useRef(0);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Auto scroll warnings active
  const [warningIndex, setWarningIndex] = useState(0);

  // Sound generator
  const triggerLighterClick = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Part 1: Metal strike click
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.04);
      gain1.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.05);

      // Part 2: Gas release hiss
      const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noiseNode = audioCtx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, audioCtx.currentTime);

      const gain2 = audioCtx.createGain();
      gain2.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      noiseNode.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioCtx.destination);
      noiseNode.start();
      noiseNode.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio context failed / browser requires interaction first
    }
  };

  // Warning slider rotations
  useEffect(() => {
    const interval = setInterval(() => {
      setWarningIndex((prev) => (prev + 1) % PHYSICAL_WARNINGS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update smoke ring decay
  useEffect(() => {
    const frame = requestAnimationFrame(function update() {
      setSmokeParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            y: p.y - 1.8, 
            opacity: p.opacity - 0.012, 
            size: p.size + 0.4
          }))
          .filter((p) => p.opacity > 0)
      );
      requestAnimationFrame(update);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Copy Contract Address Action
  const handleCopyCA = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    triggerLighterClick();
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Puff interaction action
  const handlePuff = () => {
    triggerLighterClick();
    const newCount = puffCounter + 1;
    setPuffCounter(newCount);
    localStorage.setItem('cig_puff_counter', newCount.toString());

    // Generate smoke rings near mascot
    const id = particleIdRef.current++;
    const texts = ["CIG", "$cig", "PUFF", "ASH", "100x", "SMOKE"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    // Spawn location inside hero zone
    const spawnX = Math.random() * 80 - 40; // centered drift
    const newParticle: SmokeParticle = {
      id,
      x: spawnX,
      y: 0,
      size: Math.random() * 10 + 14,
      opacity: 0.85,
      text: randomText
    };

    setSmokeParticles((prev) => [...prev, newParticle]);
  };

  // Excuse selector
  const pullExcuse = () => {
    triggerLighterClick();
    setExcuseLoading(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * EXCUSE_DATABASE.length);
      setCurrentExcuse(EXCUSE_DATABASE[idx]);
      setExcuseLoading(false);
    }, 600);
  };

  // Quiz response
  const handleAnswerSubmit = (points: number, idx: number) => {
    setSelectedAnswer(idx);
    triggerLighterClick();
    
    setTimeout(() => {
      const updatedScore = quizScore + points;
      setQuizScore(updatedScore);
      setSelectedAnswer(null);

      if (currentQuizStep + 1 < QUIZ_QUESTIONS.length) {
        setCurrentQuizStep(currentQuizStep + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 500);
  };

  const restartQuiz = () => {
    triggerLighterClick();
    setQuizScore(0);
    setCurrentQuizStep(0);
    setQuizCompleted(false);
  };

  // Get addiction classification (Cleaned from excessive emojis)
  const getAddictionRating = () => {
    if (quizScore <= 12) return {
      title: "Vape Casual / USB Sucker",
      desc: "You probably puff dynamic fruit flavors from a USB drive. You care about your scent and take moderate walks. Ciggy is disappointed. Go explore a classic CIG selection to stabilize your status.",
      color: "text-amber-800 bg-[#fbf9f4] border-stone-200"
    };
    if (quizScore <= 30) return {
      title: "Social Sparker",
      desc: "You only light up when you are in Twitter Spaces arguing with strangers. Average Solana degen level. Your layout is clean, but your wallet displays extreme potential.",
      color: "text-amber-950 bg-[#eaa135]/10 border-[#eaa135]/30"
    };
    if (quizScore <= 45) return {
      title: "The Chain Trader",
      desc: "Your space permanently smells like luxury tobacco. You check charts with a twin-sparker setup. Generational wealth is close. Ciggy formally invites you to the boardroom.",
      color: "text-[#eaa135] bg-[#1e1b18] border-[#eaa135]/50"
    };
    return {
      title: "The Human Chimney (Legendary Mascot Status)",
      desc: "You are absolute raw premium smoke. Your body runs entirely on decentralized gas. You don't need lighters anymore, you command fire with your thoughts. Immortal degen status verified!",
      color: "text-[#1e1b18] bg-[#eaa135] border-[#eaa135]"
    };
  };

  return (
    <div className="min-h-screen bg-[#fbf9f4] text-[#1e1b18] selection:bg-[#eaa135] selection:text-[#1e1b18] pb-24 overflow-x-hidden relative paper-texture">
      
      {/* BACKGROUND SMOKE BLURS - Dynamic rising particles container */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div className="absolute bottom-[-20%] left-[8%] w-[380px] h-[380px] rounded-full bg-stone-300/15 mix-blend-multiply filter blur-[80px] smoke-particle-1" />
        <div className="absolute bottom-[-15%] right-[12%] w-[420px] h-[420px] rounded-full bg-amber-200/5 mix-blend-multiply filter blur-[90px] smoke-particle-2" />
        <div className="absolute bottom-[-25%] left-[40%] w-[400px] h-[400px] rounded-full bg-stone-400/10 mix-blend-multiply filter blur-[85px] smoke-particle-3" />
      </div>

      {/* Warning Strip Header (Clean cigarette layout) */}
      <div className="bg-[#1e1b18] text-[#fbf9f4] py-2 px-4 font-mono text-center text-[10px] sm:text-xs md:text-sm font-extrabold tracking-widest uppercase flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 sticky top-0 z-50 border-b border-[#1e1b18]/10 shadow-sm select-none">
        <span className="bg-[#eaa135] text-[#1e1b18] px-2 py-0.5 text-[9px] sm:text-[10px] tracking-wider font-black rounded font-mono shrink-0">WARNING</span>
        <span className="transition-all duration-500 ease-in-out whitespace-normal break-words max-w-full leading-tight">
          {PHYSICAL_WARNINGS[warningIndex].replace("WARNING:", "").trim()}
        </span>
      </div>

      {/* Clean Navigation Container - Cigarette Theme Colors with Horizontal Quick Link Shortcuts */}
      <header className="max-w-6xl mx-auto px-4 pt-4 md:pt-6 relative z-10">
        <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-4 flex flex-col lg:flex-row gap-4 items-center justify-between rounded-2xl shadow-[4px_4px_0_0_#1e1b18]">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <img 
              src={MASCOT_IMAGE} 
              alt="CIG Mascot Logo" 
              className="w-12 h-12 rounded-full border-2 border-[#1e1b18] object-cover hover:rotate-12 transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-[#1e1b18] leading-none flex items-center gap-1.5">
                CIG <span className="text-[#eaa135] text-lg font-sans font-black italic">[$CIG]</span>
              </h1>
              <p className="text-[10px] font-mono text-stone-500 font-extrabold tracking-widest uppercase">Solana Analog Future</p>
            </div>
          </div>

          {/* Quick links to page sections - requested navigation shortcuts */}
          <nav className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-2 py-1 select-none font-mono text-xs font-black uppercase text-stone-600">
            <a href="#meme-gallery" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Meme Gallery
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
            <a href="#saga" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Addiction Saga
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
            <a href="#excuses" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Excuses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
            <a href="#quiz" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Lungs Test
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
            <a href="#timeline" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Timeline
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
            <a href="#chart" className="hover:text-[#eaa135] transition-colors relative group py-1">
              Live Chart
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#eaa135] transition-all group-hover:w-full"></span>
            </a>
          </nav>

          {/* Connected Action links */}
          <div className="flex items-center gap-2">
            {/* Minimal Twitter X button without unprompted text */}
            <a 
              href={TWITTER_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-white hover:bg-stone-100 text-[#1e1b18] p-3 border-2 border-[#1e1b18] rounded-xl flex items-center justify-center transition-all shadow-[2px_2px_0_0_#1e1b18] active:translate-x-[1px] active:translate-y-[1px]"
              title="X.com (Twitter)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href={GECKOTERMINAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#eaa135] hover:bg-white text-[#1e1b18] border-2 border-[#1e1b18] px-4 py-2 font-mono text-xs font-black uppercase rounded-xl transition-all shadow-[2px_2px_0_0_#1e1b18] active:translate-x-[1px] active:translate-y-[1px]"
            >
              GeckoTerminal
            </a>
          </div>
        </div>
      </header>

      {/* Main Hero Card styled with premium cigarette packaging vibes */}
      <section className="max-w-6xl mx-auto px-4 mt-8 relative z-10">
        
        {/* Poster Wrapper */}
        <div className="relative bg-[#fffdfa] rounded-3xl border-2 border-[#1e1b18] shadow-[8px_8px_0_0_#1e1b18] p-6 md:p-12 overflow-hidden text-center">
          
          {/* Beautiful subtle golden/tobacco warm radial background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,161,53,0.06)_0%,transparent_70%)] pointer-events-none"></div>

          {/* Active floating soot from interaction */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {smokeParticles.map((p) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${p.x}px)`,
                  bottom: `calc(40% + ${p.y}px)`,
                  fontSize: `${p.size}px`,
                  opacity: p.opacity,
                  transition: 'transform 0.1s linear',
                  zIndex: 40,
                }}
                className="font-mono text-[#eaa135] pointer-events-none select-none transition-all duration-100 font-extrabold whitespace-nowrap"
              >
                {p.text}
              </div>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            
            {/* Stamp Tag */}
            <span className="bg-[#eaa135] text-[#1e1b18] px-4 py-1.5 font-mono text-xs font-black tracking-wider uppercase mb-5 border-2 border-[#1e1b18] inline-block rounded-full shadow-[2px_2px_0_0_#1e1b18]">
              PURE ANALOG ACTION • NO USB ALLOWED
            </span>

            {/* Title with heavy Space display typography */}
            <h1 className="font-display text-5xl sm:text-8xl md:text-9xl tracking-tight text-[#1e1b18] mb-1 uppercase font-black italic select-none">
              NEED A HIT?
            </h1>

            <p className="font-mono text-base md:text-lg font-bold text-stone-600 tracking-wide uppercase px-4 py-1.5 bg-[#fbf9f4] border-2 border-[#1e1b18] rounded-xl mb-6">
              Ticker: <span className="text-[#eaa135] font-black">$cig</span>
            </p>

            {/* Mascot Container - Highlighted with gold/tobacco filter sleeve */}
            <div 
              ref={mascotRef}
              className="relative w-64 h-64 md:w-80 md:h-80 mx-auto my-4 group cursor-pointer"
              onClick={handlePuff}
            >
              {/* Outer Amber Glow */}
              <div className="absolute inset-[-10px] bg-[#eaa135] rounded-full filter blur-2xl opacity-20 group-hover:opacity-45 group-hover:scale-110 transition-all duration-300"></div>
              
              {/* Custom Image Container framed beautifully */}
              <div className="relative w-full h-full rounded-2xl border-2 border-[#1e1b18] p-3 bg-white shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]">
                <img 
                  id="target-mascot-image"
                  src={MASCOT_IMAGE} 
                  alt="Ciggy leaning off the car bottle in hand" 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-[#1e1b18] text-[#fbf9f4] text-[10px] md:text-xs font-mono py-2 font-bold rounded-xl uppercase tracking-widest shadow-lg">
                  CLICK TO PUFF & IGNITE
                </div>
              </div>
            </div>

            {/* Total Puffs Visitors counter */}
            <div className="mt-4 mb-5 bg-[#fbf9f4] text-[#1e1b18] px-6 py-3.5 border-2 border-[#1e1b18] rounded-2xl uppercase shadow-[3px_3px_0_0_#1e1b18]">
              <p className="text-[10px] tracking-widest font-mono text-stone-500 font-extrabold">DIGITAL CIGARETTES LIT ON-SITE</p>
              <p className="text-4xl font-display tracking-wider font-bold text-[#eaa135] font-black">{puffCounter}</p>
            </div>

            {/* Core Action Call buttons */}
            <div className="flex flex-wrap justify-center gap-4 w-full mt-2">
              <button 
                onClick={handlePuff}
                className="bg-[#eaa135] hover:bg-white text-[#1e1b18] font-mono text-sm font-black tracking-wider px-8 py-4 border-2 border-[#1e1b18] rounded-xl shadow-[4px_4px_0_0_#1e1b18] flex items-center gap-2 transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <Flame className="w-5 h-5" />
                PUFF CIGGY [- 🚬]
              </button>

              <a 
                href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#eaa135] text-[#1e1b18] font-mono text-sm font-black tracking-wider px-8 py-4 border-2 border-[#1e1b18] rounded-xl shadow-[4px_4px_0_0_#1e1b18] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none min-w-[180px] text-center"
              >
                BUY ON PUMP.FUN
              </a>
            </div>

            {/* Fast copy Contract bar - Improved to wrap completely instead of truncating on mobile */}
            <div className="mt-8 bg-[#fbf9f4] border-2 border-[#1e1b18] rounded-2xl p-4 w-full flex flex-col md:flex-row items-center justify-between gap-3 text-left">
              <div className="w-full">
                <p className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-widest leading-none">Holy Tobacco Seed Contract Address</p>
                <p id="target-contract-address" className="font-mono text-xs md:text-sm font-bold text-[#1e1b18] select-all break-all mt-1.5">{CONTRACT_ADDRESS}</p>
              </div>
              <button 
                onClick={handleCopyCA}
                className="bg-[#1e1b18] hover:bg-[#eaa135] text-[#fbf9f4] hover:text-[#1e1b18] font-black font-mono text-xs p-3 px-5 flex items-center gap-2 w-full md:w-auto justify-center rounded-xl transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "COPIED" : "COPY CA"}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FLOATING MEME BANNER ROTATOR / ROW 1 - SCROLLS LEFT */}
      <section id="meme-gallery" className="mt-16 bg-[#fffdfa] border-y-2 border-[#1e1b18] py-6 overflow-hidden relative ticker-container relative z-10 scroll-mt-20">
        <div className="absolute top-0 left-0 bg-[#eaa135] text-[#1e1b18] px-4 py-1.5 tracking-wider font-mono text-[10px] font-extrabold rotate-2 z-20 shadow-md border-r border-b border-[#1e1b18] rounded-br-lg">
          $CIG REEL
        </div>
        <div className="absolute bottom-0 right-0 bg-[#1e1b18] text-[#fbf9f4] px-4 py-1.5 tracking-wider font-mono text-[10px] font-extrabold -rotate-2 z-20 shadow-md border-l border-t border-[#1e1b18] rounded-tl-lg">
          ORIGINAL DEGEN MEMES
        </div>

        <div className="animate-scroll-left gap-4 pr-4">
          {[...MEME_IMAGES, ...MEME_IMAGES].map((meme, index) => (
            <div 
              key={`row1-${meme.id}-${index}`} 
              className="w-56 md:w-72 flex-shrink-0 bg-white border-2 border-[#1e1b18] p-3.5 rounded-2xl shadow-md hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-44 md:h-56 overflow-hidden border border-[#1e1b18]/10 rounded-xl bg-stone-100">
                <img 
                  src={meme.url} 
                  alt={meme.alt} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3.5 text-center">
                <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-stone-500">
                  SMOKE BREAK PROOF #{meme.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING MEME BANNER ROTATOR / ROW 2 - SCROLLS RIGHT */}
      <section className="mt-6 bg-[#fffdfa] border-b-2 border-[#1e1b18] py-6 overflow-hidden relative ticker-container relative z-10">
        <div className="animate-scroll-right gap-4 pr-4">
          {[...MEME_IMAGES, ...MEME_IMAGES].reverse().map((meme, index) => (
            <div 
              key={`row2-${meme.id}-${index}`} 
              className="w-56 md:w-72 flex-shrink-0 bg-white border-2 border-[#1e1b18] p-3.5 rounded-2xl shadow-md hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-44 md:h-56 overflow-hidden border border-[#1e1b18]/10 rounded-xl bg-stone-100">
                <img 
                  src={meme.url} 
                  alt={meme.alt} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-3.5 text-center">
                <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-wider text-stone-500">
                  TOBACCO FAITHFUL ART #{meme.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Addiction Saga - Bento grid panels */}
      <section id="saga" className="max-w-6xl mx-auto px-4 mt-20 relative z-10 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-6xl text-[#1e1b18] uppercase tracking-tight">
            Our Daily Addiction Saga
          </h2>
          <p className="text-stone-500 font-mono font-bold max-w-xl mx-auto mt-2 text-sm uppercase">
            Let's face facts: humans operate best with analog focus tools. No battery updates, no notifications – just clean organic parameters.
          </p>
        </div>

        {/* Bento grid panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: The lore */}
          <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:col-span-8 shadow-[4px_4px_0_0_#1e1b18] rounded-3xl">
            <h3 className="font-display text-2xl uppercase tracking-tight text-[#1e1b18] mb-4">The Origin of Ciggy ($CIG)</h3>
            <p className="font-sans text-stone-700 text-sm leading-relaxed mb-4 font-semibold">
              We tried drinking green smoothies, we tried cold plunging, we tried complicated breathing trackers under sterile blossom trees. The result? Total screen overload. Our high-speed brains cried out for the vintage, classic, offline physical aesthetic of the golden years.
            </p>
            <p className="font-sans text-stone-700 text-sm leading-relaxed mb-4 font-semibold">
              Then stepped forth <strong className="text-[#eaa135] font-black">Ciggy</strong> - the legendary paper-wrapped mascot holding a cold beverage, leaning off weathered trucks. He represents the ultimate cosmic focus. When the charts collapse, Ciggy sparks a light. When the charts pump, Ciggy sparks two lights. No listing parameters, no fake promises—just absolute chain-puffing degen behavior on Solana.
            </p>
            <div className="bg-[#eaa135]/5 border border-[#eaa135]/40 p-4 italic font-mono text-xs text-stone-600 font-extrabold rounded-xl mt-4">
              "Analog isn't a slow fallback option; it's a high-priority biological framework." - Ancient Wise Merchant
            </div>
          </div>

          {/* Card 2: Aesthetic slot */}
          <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-4 md:col-span-4 shadow-[4px_4px_0_0_#1e1b18] rounded-3xl flex flex-col justify-between">
            <div className="border border-[#1e1b18]/10 rounded-2xl overflow-hidden h-60 bg-stone-100 mb-3">
              <img 
                src="https://pbs.twimg.com/media/HJYwIFQagAA9FXZ?format=jpg&name=large" 
                alt="Classical smoking picture" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-[#eaa135]/10 text-stone-700 p-2.5 text-center font-mono text-[9px] font-black uppercase tracking-wider rounded-xl">
              MAXIMUM CONCENTRATION INTENSITY
            </div>
          </div>

          {/* Card 3: Doctor Opinion */}
          <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:col-span-4 shadow-[4px_4px_0_0_#1e1b18] rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="font-display text-xl uppercase mb-3 text-[#eaa135]">
                Dr. Ciggy's Perspective
              </h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed font-bold">
                Doctor stated: "Excessive oxygen has high volatility. Switch to classic CIG parameters to stabilize your daily visual indexes and trade with comfortable confidence."
              </p>
            </div>
            <div className="border-t border-dashed border-stone-200 pt-4 mt-4">
              <p className="font-mono text-xs text-[#eaa135] font-black uppercase">COGNITIVE OUTCOME STATS:</p>
              <ul className="list-disc list-inside font-mono text-xs text-stone-500 font-bold mt-2 space-y-1">
                <li>Attention depth: +420%</li>
                <li>Fidget index: 0%</li>
                <li>Coffee pairing: AMAZING</li>
              </ul>
            </div>
          </div>

          {/* Card 4: Interactive Excuse Dispenser (Pull CIG) */}
          <div id="excuses" className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:col-span-8 shadow-[4px_4px_0_0_#1e1b18] rounded-3xl flex flex-col justify-between relative scroll-mt-20">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="bg-[#1e1b18] text-[#fbf9f4] px-3 py-1 text-[9px] font-mono font-black uppercase rounded-full">Interactive Module</span>
                <span className="text-xs font-mono font-bold text-[#eaa135] animate-pulse">● LIGHTER ACTIVE</span>
              </div>
              
              <h3 className="font-display text-2xl uppercase mb-2 text-[#1e1b18]">
                Need a prompt excuse to light up?
              </h3>
              
              <p className="font-sans text-xs text-stone-500 font-bold mb-4">
                Feeling a tiny hint of guilt about lighting up that tenth analog digital cigarette of the hour? Pull a beautiful solid excuse straight out of our analog vault to settle your mind.
              </p>

              {/* Physical looking Cigarette box output container */}
              <div className="bg-[#fbf9f4] border-2 border-[#1e1b18] relative rounded-2xl my-4 min-h-[100px] flex items-center overflow-hidden shadow-inner">
                {/* Cigarette Filter Stripe Indicator on Left */}
                <div className="absolute left-0 top-0 bottom-0 w-6 filter-gradient border-r-2 border-[#1e1b18] flex items-center justify-center">
                  {/* Tiny cork dots effect */}
                  <div className="w-full h-full opacity-10 bg-[radial-gradient(#1e1b18_1px,transparent_1px)] [background-size:4px_4px]"></div>
                </div>
                
                <div className="pl-10 pr-4 py-5 text-center w-full">
                  {excuseLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#eaa135] animate-spin" />
                      <span className="font-mono text-xs font-bold text-stone-500 uppercase">Searching golden ashes...</span>
                    </div>
                  ) : (
                    <p className="font-mono text-xs md:text-sm font-black text-stone-700 italic leading-relaxed">
                      "{currentExcuse}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button 
                onClick={pullExcuse}
                disabled={excuseLoading}
                className="bg-[#eaa135] hover:bg-stone-900 hover:text-white text-[#1e1b18] border-2 border-[#1e1b18] px-6 py-3 rounded-xl font-mono text-xs font-black uppercase transition-all shadow-[2px_2px_0_0_#1e1b18] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                SPARK AN EXCUSE
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* HOW TO BUY SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-20 relative z-10">
        <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:p-12 shadow-[8px_8px_0_0_#1e1b18] rounded-3xl">
          
          <div className="border border-[#eaa135]/40 p-6 rounded-2xl bg-[#eaa135]/5 text-center mb-10">
            <h2 className="font-display text-3xl md:text-5xl text-[#1e1b18] uppercase leading-none select-none tracking-tight">
              Trade Steps
            </h2>
            <div className="bg-[#1e1b18] text-[#fbf9f4] font-mono text-[9px] uppercase px-4 py-1.5 font-black tracking-widest mt-3 rounded-full inline-block">
              VINTAGE SETUP ONLY
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {BUY_STEPS.map((b) => (
              <div key={b.step} className="bg-[#fbf9f4] hover:bg-[#eaa135]/5 border-2 border-[#1e1b18] p-5 rounded-2xl relative flex flex-col justify-between hover:scale-[1.02] hover:shadow-md transition-all duration-200">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-4xl text-[#eaa135]">{b.step}</span>
                    <span className="bg-[#1e1b18] text-[#fbf9f4] rounded-full p-1 text-[9px] font-mono font-bold w-6 h-6 flex items-center justify-center">✔</span>
                  </div>
                  <h4 className="font-display text-xl uppercase mb-2 text-[#1e1b18]">{b.title}</h4>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed font-bold break-all sm:break-words">{b.description}</p>
                </div>
                <div className="h-[3px] w-full filter-gradient mt-6 rounded"></div>
              </div>
            ))}
          </div>

          {/* Quick interactive shortcut block to pump.fun */}
          <div className="mt-8 border-2 border-dashed border-stone-300 p-5 bg-[#fbf9f4] rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="w-full">
              <h5 className="font-mono text-xs font-black text-[#1e1b18] uppercase">Verify exact pool contract address</h5>
              <p className="font-mono text-[10px] md:text-xs text-stone-500 font-bold break-all select-all mt-1">{CONTRACT_ADDRESS}</p>
            </div>
            
            <a 
              href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#eaa135] hover:bg-stone-900 hover:text-white text-[#1e1b18] font-mono text-xs font-black py-3 px-6 border-2 border-[#1e1b18] rounded-xl uppercase tracking-wider shadow-[2px_2px_0_0_#1e1b18] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none inline-flex items-center gap-1.5 transition-all shrink-0 w-full sm:w-auto justify-center"
            >
              <span>EXPLORE PUMP</span>
              <ExternalLink className="w-3" />
            </a>
          </div>

        </div>
      </section>

      {/* ADDICTION DIAGNOSIS QUIZ */}
      <section id="quiz" className="max-w-3xl mx-auto px-4 mt-20 relative z-10 scroll-mt-20">
        <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:p-10 shadow-[8px_8px_0_0_#1e1b18] rounded-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-200 pb-4 mb-6">
            <div>
              <span className="bg-[#eaa135]/15 text-[#eaa135] text-[9px] font-mono font-black uppercase px-2.5 py-1 border border-[#eaa135]/30 rounded-full">Official Diagnostic</span>
              <h3 className="font-display text-2xl uppercase text-[#1e1b18] mt-1.5">Compute Ash-Factor Score</h3>
            </div>
          </div>

          {!quizCompleted ? (
            <div className="bg-[#fbf9f4] border-2 border-[#1e1b18] p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between text-[11px] font-mono font-black text-stone-400 mb-2">
                <span>QUESTION {currentQuizStep + 1} OF {QUIZ_QUESTIONS.length}</span>
                <span className="text-[#eaa135]">SCORE: {quizScore} PTS</span>
              </div>
              
              <h4 className="font-display text-lg text-[#1e1b18] mb-4 py-2 bg-[#eaa135]/10 px-3 border-l-4 border-[#eaa135] uppercase font-bold rounded-r-lg">
                {QUIZ_QUESTIONS[currentQuizStep].question}
              </h4>

              <div className="space-y-2 mt-4">
                {QUIZ_QUESTIONS[currentQuizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSubmit(opt.points, idx)}
                    className={`w-full text-left p-3.5 font-mono text-xs font-extrabold uppercase border-2 rounded-xl transition-all flex items-center justify-between gap-2 ${
                      selectedAnswer === idx 
                        ? "bg-[#1e1b18] text-[#fbf9f4] border-[#1e1b18]" 
                        : "bg-white hover:bg-[#eaa135]/10 text-stone-700 hover:text-[#1e1b18] border-stone-200 hover:border-[#1e1b18] hover:translate-x-0.5"
                    }`}
                  >
                    <span className="flex-1 pr-2 break-words leading-relaxed">{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-[#eaa135] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#fbf9f4] border-2 border-[#1e1b18] p-6 rounded-2xl text-center shadow-inner">
              <h4 className="font-display text-2xl uppercase text-[#1e1b18] mb-1">DIAGNOSTIC STATUS</h4>
              
              <div className={`p-4 border-2 font-mono text-xs font-black uppercase rounded-xl inline-block my-3 px-6 ${
                getAddictionRating().color
              }`}>
                {getAddictionRating().title}
              </div>

              <p className="font-mono text-xs text-stone-600 leading-relaxed max-w-lg mx-auto mb-6 font-bold leading-relaxed">
                "{getAddictionRating().desc}"
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={restartQuiz}
                  className="bg-[#1e1b18] hover:bg-[#eaa135] hover:text-[#1e1b18] text-[#fbf9f4] font-mono text-xs font-black uppercase py-2.5 px-6 rounded-xl transition-all shadow-md"
                >
                  RETEST NOW
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=I%20just%20took%20the%20CIG%20Solana%20addiction%20quiz.%20My%20result%20is%20${encodeURIComponent(getAddictionRating().title)}.%20Are%20your%20digital%20lungs%20glowing%3F%20Buy%20$cig%20at%20${CONTRACT_ADDRESS}%20🔥🚬`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#eaa135] hover:bg-[#1e1b18] hover:text-[#fbf9f4] text-[#1e1b18] font-mono text-xs font-black uppercase py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  SHARE RESULT ON X
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section id="timeline" className="max-w-6xl mx-auto px-4 mt-20 relative z-10 scroll-mt-20">
        <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-6 md:p-12 shadow-[8px_8px_0_0_#1e1b18] rounded-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl uppercase text-[#1e1b18] tracking-tight">
              THE BURN TIMELINE
            </h2>
            <p className="font-mono text-xs text-[#eaa135] font-extrabold uppercase mt-1">
              No complex indices. Just quality ashes and vibes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {ROADMAP_ITEMS.map((item, index) => (
              <div 
                key={item.phase} 
                className="bg-[#fbf9f4] hover:bg-[#eaa135]/5 border-2 border-[#1e1b18] p-5 rounded-2xl relative flex flex-col justify-between hover:scale-[1.03] transition-transform duration-200"
              >
                {/* Visual burn status wrapper */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-[#eaa135] text-[#1e1b18] px-3 py-1 text-[10px] font-mono uppercase font-black rounded-full border border-[#1e1b18]">
                      PHASE {item.phase}
                    </span>
                  </div>

                  <h4 className="font-display text-xl uppercase mb-2 text-[#1e1b18]">{item.title}</h4>
                  <p className="font-sans text-xs text-stone-600 leading-relaxed font-bold break-words">{item.description}</p>
                </div>

                <div className="mt-6 border-t border-stone-200 pt-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border border-[#1e1b18] ${
                      item.status === 'burned' ? 'bg-stone-700' :
                      item.status === 'smoking' ? 'bg-[#eaa135] animate-pulse' :
                      'bg-stone-100'
                    }`}></span>
                    <span className="font-mono text-[9px] font-extrabold uppercase text-stone-500">
                      STATUS: {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick funny legal-looking badge */}
          <div className="mt-8 bg-[#fbf9f4] text-stone-500 border-2 border-[#1e1b18] p-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider rounded-2xl font-bold">
            NOTE FOR DETECTIVES: We do not plan to write whitepapers. Lighter has 100% capacity. Digital ashes belong to buyers.
          </div>
        </div>
      </section>

      {/* LIVE CHART SECTION */}
      <section id="chart" className="max-w-6xl mx-auto px-4 mt-20 relative z-10 scroll-mt-20">
        <div className="bg-[#fffdfa] border-2 border-[#1e1b18] p-4 md:p-8 shadow-[8px_8px_0_0_#1e1b18] rounded-3xl">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="bg-[#eaa135] text-[#1e1b18] text-[9px] font-mono font-black border border-[#1e1b18] px-3 py-1 uppercase rounded-full">REALTIME ACCELERATION</span>
              <h3 className="font-display text-3xl uppercase text-[#1e1b18] mt-2">DEX CHART DECK</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={GECKOTERMINAL_URL}
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-[#1e1b18] hover:bg-[#eaa135] text-[#fbf9f4] hover:text-[#1e1b18] px-4 py-2.5 rounded-xl text-xs font-mono font-black uppercase transition-all"
              >
                GECKOTERMINAL POOL
              </a>
            </div>
          </div>

          {/* Chart Iframe box */}
          <div className="relative border-2 border-[#1e1b18] aspect-video w-full overflow-hidden bg-stone-900 rounded-2xl shadow-sm">
            <iframe 
              src={DEXSCREENER_EMBED_URL}
              className="absolute inset-0 w-full h-full border-0"
              title="CIG Solana Search Chart"
              allow="clipboard-write"
            ></iframe>
          </div>

          <div className="mt-5 text-center">
            <p className="font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-stone-500 font-extrabold leading-relaxed">
              LIVE DATA STREAMED VIA DEXSCREENER • RETEST THE CHART WHILE BLOWING COMPACT DIGITAL RINGS
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-20 relative z-10">
        <h3 className="font-display text-3xl md:text-5xl uppercase text-center text-[#1e1b18] mb-10 tracking-tight">
          What Degens Say About $CIG
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FUNNY_TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-[#fffdfa] border-2 border-[#1e1b18] p-5 relative rounded-2xl flex flex-col justify-between shadow-md">
              <div>
                <p className="font-mono text-xs italic text-stone-700 leading-relaxed font-bold pt-2 mb-4">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t border-dashed border-stone-200 pt-3 flex items-center gap-3">
                <img 
                  src={t.avatar} 
                  alt={t.user} 
                  className="w-10 h-10 rounded-full border border-stone-200 object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div>
                  <h5 className="font-display text-xs uppercase text-[#1e1b18]">{t.user}</h5>
                  <p className="text-[9px] font-mono font-black uppercase text-stone-400">Verified CIG Holder</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION & TOBACCO WARNING REPLICA BOX */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center relative z-10">
        
        {/* Giant classic white/black warning box styled label */}
        <div className="bg-white border-4 border-[#1e1b18] text-[#1e1b18] py-8 px-6 max-w-2xl mx-auto uppercase tracking-tighter leading-none mb-12 shadow-[4px_4px_0_0_#1e1b18] rounded-3xl">
          <p className="font-mono text-xl sm:text-2xl md:text-3xl font-black mb-4 text-[#1e1b18]">CIGARETTES WARNING:</p>
          <div className="h-0.5 bg-stone-300 w-full my-4"></div>
          <p className="font-sans text-xs sm:text-sm font-bold leading-normal text-stone-600 max-w-xl mx-auto">
            TRADING MEMECOINS CAUSES SEVERE EMOTIONAL SWINGS, DECREASED DESIRE TO GO OUTSIDE, AND UNCONTROLLED COUGHING OUTSIDE COFFEE SHOPS. $CIG CONTAINS 0% REAL TOBACCO AND IS ENTIRELY COMPATIBLE WITH CONCENTRATELY FUNNY BRAIN ROT. DO NOT ATTEMPT TO SMOKE YOUR COMPUTER WORKSTATION.
          </p>
        </div>

        {/* Mascot tiny signature link and copyright */}
        <div className="flex flex-col items-center gap-3">
          <img 
            src={MASCOT_IMAGE} 
            alt="Mini Ciggy logo" 
            className="w-10 h-10 rounded-full border border-[#1e1b18]/10 object-cover"
            referrerPolicy="no-referrer"
          />
          <p className="font-mono text-[9px] md:text-[10px] text-stone-500 font-extrabold uppercase tracking-widest">
            © 2026 CIG ON SOLANA ($cig) • DESIGNED FOR THE COMFORTABLE TOBACCO FAITHFULS
          </p>
          <p className="font-mono text-[8px] md:text-[9px] text-stone-400 max-w-lg leading-relaxed">
            Disclaimer: $CIG is an educational/entertainment memecoin with exactly zero utility, zero underlying intrinsic value, and zero investment assurances. Use lighters responsibly.
          </p>
        </div>

      </footer>

    </div>
  );
}
