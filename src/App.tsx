import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Trophy, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ThumbsUp,
  Skull
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
    const texts = ["💭", "💨", "🚬", "CIG", "$cig", "PUFF", "ASH", "100x"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    
    // Spawn location inside hero zone
    const spawnX = Math.random() * 80 - 40; // centered drift
    const newParticle: SmokeParticle = {
      id,
      x: spawnX,
      y: 0,
      size: Math.random() * 12 + 16,
      opacity: 0.9,
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

  // Get addiction classification
  const getAddictionRating = () => {
    if (quizScore <= 12) return {
      title: "Vape Casual / Usb Sucker 🍓",
      desc: "You probably puff dynamic fruit flavors from a USB drive. You care about your scent and take moderate walks. Ciggy is highly disappointed. Go light a classic $CIG to redeem yourself immediately!",
      color: "text-blue-500 bg-blue-50 border-blue-200"
    };
    if (quizScore <= 30) return {
      title: "Social Sparker 🍻",
      desc: "You only light up when you are in Twitter Spaces arguing with strangers. Average Solana degen level. Your teeth are still white, but your wallet displays extreme potential.",
      color: "text-amber-600 bg-amber-50 border-amber-200"
    };
    if (quizScore <= 45) return {
      title: "The Chain Trader 🔥",
      desc: "Your space is permanently smelling like luxury tobacco. You check charts with a dynamic twin-sparker setup. Generational wealth is close. Ciggy formally invites you to the boardroom.",
      color: "text-orange-600 bg-orange-50 border-orange-200"
    };
    return {
      title: "The Human Chimney (Mascot Level) 🚬☠️",
      desc: "You are 99.4% absolute raw premium smoke. Your body runs entirely on decentralized gas. You don't need lighters anymore, you command fire with your thoughts. Immortal degen status verified!",
      color: "text-red-700 bg-red-50 border-red-200"
    };
  };

  return (
    <div className="min-h-screen bg-[#111] text-white smoky-bg selection:bg-[#ff4500] selection:text-white pb-20 overflow-x-hidden relative">
      
      {/* Absolute top rotating warning header - Bold Black & Neon Orange style */}
      <div className="bg-black/90 border-b-2 border-[#ff4500] backdrop-blur-md text-white py-3 px-4 font-mono text-center text-xs md:text-sm font-bold tracking-tight uppercase flex items-center justify-center gap-2 overflow-hidden sticky top-0 z-50">
        <AlertTriangle className="w-5 h-5 text-[#ff4500] animate-bounce cursor-pointer" onClick={triggerLighterClick} />
        <span className="text-[#ff4500] tracking-wider transition-all duration-500 ease-in-out font-black">
          {PHYSICAL_WARNINGS[warningIndex]}
        </span>
      </div>

      {/* Main Retro Styled Navigation Container - Bold Typography Dark Theme */}
      <header className="max-w-6xl mx-auto px-4 pt-4 md:pt-6">
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 inline-flex w-full items-center justify-between rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          
          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <img 
              src={MASCOT_IMAGE} 
              alt="CIG Mascot Logo" 
              className="w-12 h-12 rounded-full border-2 border-[#ff4500] object-cover shadow-sm hover:rotate-12 transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white leading-none flex items-center gap-1.5">
                CIG <span className="text-[#ff4500] text-lg font-sans font-black italic">[$CIG]</span>
              </h1>
              <p className="text-[10px] md:text-xs font-mono text-[#ff4500] font-bold tracking-widest uppercase">Est. 2026 Solana</p>
            </div>
          </div>

          {/* Social Links Panel / Sticky buttons */}
          <div className="flex items-center gap-2">
            <a 
              href={TWITTER_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-zinc-900 hover:bg-[#ff4500] hover:text-white text-white px-3.5 py-2 border border-white/15 font-mono text-xs font-extrabold uppercase flex items-center gap-1.5 transition-all rounded-lg"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X.com (2026)</span>
            </a>
            <a 
              href={GECKOTERMINAL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#ff4500] hover:bg-white hover:text-black text-white px-3.5 py-2 border border-transparent font-mono text-xs font-extrabold uppercase flex items-center gap-1.5 transition-all rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GeckoTerminal</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Poster Section - Dark smoky neon-orange overlay with NEED A HIT typography */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        
        {/* Poster Wrapper */}
        <div className="relative bg-gradient-to-b from-neutral-900/95 via-black to-neutral-950/95 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-6 md:p-12 overflow-hidden text-center">
          
          {/* Orange neon radial background glow simulation */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,69,0,0.18)_0%,transparent_70%)] pointer-events-none"></div>

          {/* Floating Smoke rings */}
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
                className="font-display text-white filter drop-shadow-[0_2px_8px_rgba(255,165,0,0.8)] pointer-events-none select-none transition-all duration-100 font-bold"
              >
                {p.text}
              </div>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            
            {/* Stamp Tag */}
            <span className="bg-[#ff4500] border border-transparent text-white px-4 py-1.5 font-mono text-xs font-extrabold tracking-widest uppercase mb-4 shadow-[0_0_12px_rgba(255,69,0,0.4)] inline-block rounded-full">
              🔥 100% PURE BRAIN ROT • NO VAPE ALLOWED 🔥
            </span>

            {/* Title with heavy neon shadow (Bold Typography design) */}
            <h1 className="font-display text-7xl sm:text-8xl md:text-9xl tracking-[0.02em] text-[#ff4500] neon-glow mb-1 uppercase font-black italic">
              NEED A HIT?
            </h1>

            <p className="font-mono text-lg md:text-xl font-black text-white tracking-wide uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-lg mb-6">
              Ticker: <span className="text-[#ff4500]">$cig</span>
            </p>

            {/* Mascot Container - Highlighted with orange fire radiation */}
            <div 
              ref={mascotRef}
              className="relative w-64 h-64 md:w-80 md:h-80 mx-auto my-4 group cursor-pointer"
              onClick={handlePuff}
            >
              {/* Outer Neon Glow Radiation Effect */}
              <div className="absolute inset-[-15px] bg-[#ff4500] rounded-full filter blur-2xl opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300 animate-pulse"></div>
              
              {/* Custom Image Container framed beautifully */}
              <div className="relative w-full h-full rounded-3xl border-2 border-white/20 p-2 bg-black/60 shadow-[0_12px_36px_rgba(255,69,0,0.15)] overflow-hidden transition-transform duration-200 group-hover:scale-[1.03] group-hover:rotate-1">
                <img 
                  id="target-mascot-image"
                  src={MASCOT_IMAGE} 
                  alt="Ciggy leaning off the car bottle in hand" 
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-3 right-3 bg-[#ff4500] text-white text-[10px] md:text-xs font-mono py-1.5 font-bold rounded-xl uppercase tracking-wider shadow-lg">
                  ⚡ CLICK TO PUFF [- 🚬] & SPARK FIRE ⚡
                </div>
              </div>
            </div>

            {/* Total Puffs Visitors counter */}
            <div className="mt-4 mb-4 bg-zinc-950/80 text-white px-6 py-3 border border-white/10 rounded-2xl uppercase shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
              <p className="text-[10px] tracking-widest font-mono text-zinc-500 font-bold">Total Digital Smokes Lit On-Site:</p>
              <p className="text-3xl font-display tracking-wider font-bold text-[#ff4500] neon-glow font-black">{puffCounter}</p>
            </div>

            {/* Core Action Call buttons */}
            <div className="flex flex-wrap justify-center gap-4 w-full mt-2">
              <button 
                onClick={handlePuff}
                className="bg-[#ff4500] hover:bg-white hover:text-black text-white font-display text-xl px-8 py-4 border-2 border-transparent rounded-xl shadow-[0_4px_12px_rgba(255,69,0,0.3)] flex items-center gap-2 transition-all transform active:translate-x-[2px] active:translate-y-[2px]"
              >
                <Flame className="w-6 h-6 fill-white animate-pulse" />
                PUFF CIGGY [- 🚬]
              </button>

              <a 
                href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-[#ff4500] hover:text-white text-black font-display text-xl px-8 py-4 border-2 border-transparent rounded-xl shadow-lg transition-all transform active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center"
              >
                BUY ON PUMP.FUN 🚀
              </a>
            </div>

            {/* Fast copy Contract bar */}
            <div className="mt-8 bg-zinc-950/90 border border-white/10 rounded-2xl p-4 w-full flex flex-col md:flex-row items-center justify-between gap-3 text-left backdrop-blur-md">
              <div className="w-full truncate">
                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest leading-none">Holy Tobacco Seed Contract</p>
                <p id="target-contract-address" className="font-mono text-xs md:text-sm font-bold text-white select-all break-all mt-1">{CONTRACT_ADDRESS}</p>
              </div>
              <button 
                onClick={handleCopyCA}
                className="bg-white hover:bg-[#ff4500] hover:text-white text-black font-semibold font-mono text-xs p-2.5 px-5 flex items-center gap-2 w-full md:w-auto justify-center rounded-xl transition-all shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "COPIED!" : "COPY CONTRACT"}</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FLOATING MEME BANNER ROTATOR / ROW 1 - SCROLLS LEFT */}
      <section className="mt-12 bg-black/40 border-y border-white/10 py-5 overflow-hidden relative ticker-container backdrop-blur-sm">
        <div className="absolute top-0 left-0 bg-[#ff4500] text-white px-3 py-1 tracking-wider font-mono text-[10px] font-extrabold rotate-3 z-20 shadow-md rounded-br-lg">
          $CIG REEL
        </div>
        <div className="absolute bottom-0 right-0 bg-red-650 text-white px-3 py-1 tracking-wider font-mono text-[10px] font-extrabold -rotate-3 z-20 shadow-md rounded-tl-lg">
          WARNING: MEMES AHEAD
        </div>

        <div className="animate-scroll-left gap-4 pr-4">
          {/* Multiply array to support continuous loop scrolling */}
          {[...MEME_IMAGES, ...MEME_IMAGES].map((meme, index) => (
            <div 
              key={`row1-${meme.id}-${index}`} 
              className="w-56 md:w-72 flex-shrink-0 bg-zinc-950 border border-white/10 p-3 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-200 cursor-zoom-in"
            >
              <div className="relative h-44 md:h-56 overflow-hidden border border-white/10 rounded-xl bg-neutral-900">
                <img 
                  src={meme.url} 
                  alt={meme.alt} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-tight text-zinc-400">
                  ⚡ SECURE SMOKE BREAK #{meme.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING MEME BANNER ROTATOR / ROW 2 - SCROLLS RIGHT */}
      <section className="mt-6 bg-black/40 border-b border-white/10 py-5 overflow-hidden relative ticker-container backdrop-blur-sm">
        <div className="animate-scroll-right gap-4 pr-4">
          {[...MEME_IMAGES, ...MEME_IMAGES].reverse().map((meme, index) => (
            <div 
              key={`row2-${meme.id}-${index}`} 
              className="w-56 md:w-72 flex-shrink-0 bg-zinc-950 border border-white/10 p-3 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-200 cursor-zoom-in"
            >
              <div className="relative h-44 md:h-56 overflow-hidden border border-white/10 rounded-xl bg-neutral-900">
                <img 
                  src={meme.url} 
                  alt={meme.alt} 
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="font-mono text-[10px] md:text-xs font-bold uppercase tracking-tight text-zinc-400">
                  🔥 CERTIFIED TOBACCO ART #{meme.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Narrative layout - Bento grids of funny daily addiction stories */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-6xl text-white uppercase tracking-tight">
            Our Daily Addiction Saga 🚬
          </h2>
          <p className="text-zinc-400 font-mono font-bold max-w-xl mx-auto mt-2 text-sm uppercase">
            Let's face it: humans cannot operate without virtual cigarette triggers. Nicotine is basically high-speed layer-0 software for your organic hardware.
          </p>
        </div>

        {/* Bento grid panels */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: The lore */}
          <div className="bg-gradient-to-br from-neutral-900/80 to-zinc-950/85 border border-white/10 p-6 md:col-span-8 shadow-2xl rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl text-[#ff4500]">📖</span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-[#ff4500] neon-glow">The Origin of Ciggy ($CIG)</h3>
            </div>
            <p className="font-sans text-base leading-relaxed text-zinc-300 mb-4 font-medium">
              We tried drinking green smoothies, we tried cold plunging, we tried dynamic meditation under cherry blossom trees. The result? Total boredom. Our brain cells were crying out for a vintage, organic, non-USB analog lifestyle of the 1980s.
            </p>
            <p className="font-sans text-base leading-relaxed text-zinc-300 mb-4 font-medium">
              Then stepped forth <strong className="text-[#ff4500]">Ciggy</strong> - the legendary paper-wrapped mascot holding a retro bottle, leaning off rusted trucks. He represents the ultimate cosmic focus. When the charts collapse, Ciggy sparks a light. When the charts pump, Ciggy sparks two lights. No listing parameters, no fancy utility talk—just pure, unapologetic chain-puffing degen behavior on Solana.
            </p>
            <div className="bg-[#ff4500]/10 border border-[#ff4500]/30 p-3.5 italic font-mono text-xs text-zinc-200 font-semibold rounded-xl">
              "Nicotine isn't just an addiction, it's a dynamic web3 transaction coordinator." - Ancient Smoking Degen Prophecy
            </div>
          </div>

          {/* Card 2: Image slot with custom bubble description */}
          <div className="bg-neutral-900/50 border border-white/10 p-4 md:col-span-4 shadow-2xl rounded-3xl flex flex-col justify-between">
            <div className="border border-white/10 rounded-2xl overflow-hidden h-64 bg-zinc-950 mb-3">
              <img 
                src="https://pbs.twimg.com/media/HJYwIFQagAA9FXZ?format=jpg&name=large" 
                alt="Classical smoking picture" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="bg-black/60 border border-white/5 text-zinc-300 p-2.5 text-center font-mono text-[10px] font-bold uppercase rounded-xl">
              ⚡ MAXIMUM FOCUS CONCENTRATED IN CIGS ⚡
            </div>
          </div>

          {/* Card 3: Why it matters - funny details */}
          <div className="bg-neutral-900/50 border border-white/10 p-6 md:col-span-4 shadow-2xl rounded-3xl">
            <h4 className="font-display text-xl uppercase mb-3 flex items-center gap-2 text-[#ff4500]">
              <span>🩺</span> Dr. Ciggy's Opinion
            </h4>
            <p className="font-sans text-sm text-zinc-300 leading-relaxed font-semibold mb-3">
              Doctor stated: "Oxygen is highly overrated. It contains 0% premium internet humor and has high volatility. I recommend patients immediately switch to $cig to stabilize cognitive retests."
            </p>
            <div className="border-t border-dashed border-white/15 pt-3 mt-3">
              <p className="font-mono text-xs text-[#ff4500] font-bold uppercase">📊 COGNITIVE OUTCOME STATS:</p>
              <ul className="list-disc list-inside font-mono text-xs text-zinc-400 font-bold mt-1 space-y-1">
                <li>Attention level: +420%</li>
                <li>Wallet adrenaline: INTENSE</li>
                <li>Coffee taste multiplier: 10x</li>
              </ul>
            </div>
          </div>

          {/* Card 4: Interactive Excuse Dispenser (Pull CIG) */}
          <div className="bg-gradient-to-tr from-zinc-950 to-neutral-900/90 border border-white/10 p-6 md:col-span-8 shadow-2xl rounded-3xl flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#ff4500] text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full">Interactive Drawer</span>
                <span className="text-xs font-mono font-bold text-[#ff4500] animate-pulse">● LIGHTER ACTIVE</span>
              </div>
              
              <h3 className="font-display text-2xl uppercase mb-2 text-white">
                Should I smoke a cig right now? 🤔
              </h3>
              
              <p className="font-sans text-sm text-zinc-400 font-semibold mb-6">
                Are you feeling guilty about lighting up your fourteenth digital cigarette of the hour? Pull a randomized excuse out of our premium virtual drawer to clear your conscience instantly!
              </p>

              {/* Physical looking Cigarette box output container */}
              <div className="bg-black/40 border border-white/10 p-5 relative rounded-2xl my-4 min-h-[100px] flex items-center justify-center overflow-hidden">
                {/* Visual filter cap on left */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#ff4500] flex items-center justify-center select-none font-bold text-[10px] text-white font-mono rotate-180 writing-mode-vertical">
                  FILTER
                </div>
                
                <div className="pl-8 text-center">
                  {excuseLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 text-[#ff4500] animate-spin" />
                      <span className="font-mono text-xs font-bold text-zinc-500 uppercase">Pulling fresh digital soot...</span>
                    </div>
                  ) : (
                    <p className="font-mono text-sm font-bold text-zinc-100 italic leading-relaxed">
                      "{currentExcuse}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
              <button 
                onClick={pullExcuse}
                disabled={excuseLoading}
                className="bg-[#ff4500] hover:bg-white hover:text-black text-white px-5 py-3 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>🔥 PULL A FRESH EXCUSE</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* HOW TO BUY SECTION - Retro Warning Wrapper styled after cigarette backpanel warning */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-zinc-950/90 border border-white/10 p-6 md:p-12 shadow-2xl rounded-3xl">
          
          {/* Sarcastic Government-style warning block header */}
          <div className="border border-[#ff4500]/30 p-6 rounded-2xl bg-[#ff4500]/5 text-center shadow-[inset_0_0_12px_rgba(255,69,0,0.1)] mb-10">
            <h2 className="font-display text-3xl md:text-5xl text-[#ff4500] neon-glow uppercase leading-none select-none tracking-tight">
              HOW TO BUY $CIG ON PUMP.FUN
            </h2>
            <div className="bg-red-650 text-white font-mono text-xs uppercase px-4 py-1.5 font-extrabold tracking-widest mt-3 rounded-full inline-block">
              WARNING: PURCHASING MAY RESULT IN EXTREME LEVEL OF COMFORT
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {BUY_STEPS.map((b) => (
              <div key={b.step} className="bg-neutral-900/40 hover:bg-[#ff4500]/5 border border-white/10 p-5 rounded-2xl relative flex flex-col justify-between hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(255,69,0,0.1)] transition-all duration-200">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display text-4xl text-[#ff4500] neon-glow">{b.step}</span>
                    <span className="bg-[#ff4500] text-white rounded-full p-1 text-[10px] font-mono font-bold w-6 h-6 flex items-center justify-center">✔</span>
                  </div>
                  <h4 className="font-display text-xl uppercase mb-2 text-white">{b.title}</h4>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed font-semibold">{b.description}</p>
                </div>
                <div className="h-[2px] w-full bg-gradient-to-r from-[#ff4500] to-red-600 mt-6 border-t border-white/10"></div>
              </div>
            ))}
          </div>

          {/* Quick interactive shortcut block to pump.fun */}
          <div className="mt-8 border border-dashed border-white/20 p-5 bg-zinc-900/20 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <h5 className="font-mono text-sm font-black text-white uppercase">Ready to trade the analog future?</h5>
              <p className="font-sans text-xs text-zinc-400 font-medium">Verify you look at the exact correct pool: B5ihVH6qRkGTXhp61MZG5rRAmaCwtva3P2gRbZZrFU65</p>
            </div>
            
            <a 
              href={`https://pump.fun/coin/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ff4500] hover:bg-white hover:text-black text-white font-mono text-xs font-bold py-3 px-6 border border-transparent rounded-xl uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all text-center"
            >
              <span>GO TO PUMP.FUN</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>

      {/* WEB ACCESS ADDICTION QUIZ - STICKY CARD STYLE */}
      <section className="max-w-3xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-br from-neutral-900 via-zinc-950 to-neutral-900 border border-white/10 p-6 md:p-10 shadow-2xl rounded-3xl">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-3xl text-[#ff4500]">🧫</span>
            <div>
              <span className="bg-red-500/10 text-red-400 text-[10px] font-mono font-black uppercase px-2 py-0.5 border border-red-500/20 rounded-full">Official CDC Warning Mock</span>
              <h3 className="font-display text-2xl uppercase text-white">DIAGNOSIS: HOW ADDICTED ARE YOU?</h3>
            </div>
          </div>

          <p className="font-sans text-xs text-zinc-400 font-bold mb-6">
            Complete this fast 4-question analog diagnostic query to compute your virtual ash-factor score. See if you can grab Ciggy's respect.
          </p>

          {!quizCompleted ? (
            <div className="bg-black/40 border border-white/10 p-5 rounded-2xl shadow-inner">
              <div className="flex justify-between text-xs font-mono font-bold text-zinc-500 mb-2">
                <span>QUESTION {currentQuizStep + 1} OF {QUIZ_QUESTIONS.length}</span>
                <span className="text-[#ff4500] font-black">ASH SCORE: {quizScore} pts</span>
              </div>
              
              <h4 className="font-display text-lg text-white mb-4 py-2 bg-[#ff4500]/10 px-3 border-l-4 border-[#ff4500] uppercase font-bold rounded-r-lg">
                {QUIZ_QUESTIONS[currentQuizStep].question}
              </h4>

              <div className="space-y-2 mt-4">
                {QUIZ_QUESTIONS[currentQuizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSubmit(opt.points, idx)}
                    className={`w-full text-left p-3.5 font-mono text-xs font-bold uppercase border rounded-xl transition-all flex items-center justify-between ${
                      selectedAnswer === idx 
                        ? "bg-[#ff4500] text-white border-transparent" 
                        : "bg-zinc-900/80 hover:bg-[#ff4500]/10 text-zinc-100 hover:text-white border-white/10 hover:border-[#ff4500] hover:translate-x-1"
                    }`}
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-[#ff4500]" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-white/10 p-6 rounded-2xl text-center">
              <Trophy className="w-12 h-12 text-[#ff4500] mx-auto mb-2 animate-bounce" />
              <h4 className="font-display text-2xl uppercase text-white mb-2">DIAGNOSTIC VERDICT:</h4>
              
              <div className={`p-4 border font-mono text-xs font-black uppercase rounded-xl inline-block my-3 ${
                getAddictionRating().color.includes('red-700') ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                getAddictionRating().color.includes('orange-600') ? 'text-orange-400 border-orange-500/20 bg-[#ff4500]/10' :
                getAddictionRating().color.includes('amber-600') ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                'text-blue-400 border-blue-500/20 bg-blue-500/10'
              }`}>
                {getAddictionRating().title}
              </div>

              <p className="font-mono text-xs text-zinc-300 leading-relaxed max-w-lg mx-auto mb-6">
                "{getAddictionRating().desc}"
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={restartQuiz}
                  className="bg-[#ff4500] hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase py-2.5 px-6 rounded-xl transition-all shadow-md"
                >
                  RETEST MY LUNGS 🔄
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=I%20just%20took%20the%20CIG%20Solana%20addiction%20quiz.%20My%20result%20is%20${encodeURIComponent(getAddictionRating().title)}.%20Are%20your%20digital%20lungs%20glowing%3F%20Buy%20$cig%20at%20${CONTRACT_ADDRESS}%20🔥🚬`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-white hover:text-black text-white font-mono text-xs font-bold uppercase py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
                >
                  SHARE RESULT ON X ⚡
                </a>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ROADMAP SECTION - EXTREMELY FUNNY, NO COMPLICATED UTILITY TALK */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-zinc-950/90 border border-white/10 p-6 md:p-12 shadow-2xl rounded-3xl">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl uppercase text-white tracking-tight">
              THE BURN TIMELINE 📑
            </h2>
            <p className="font-mono text-xs text-[#ff4500] font-extrabold uppercase mt-1">
              No partnerships listed. No high-frequency trading indices. Just smoke and vibes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {ROADMAP_ITEMS.map((item, index) => (
              <div 
                key={item.phase} 
                className="bg-[#ff4500]/5 hover:bg-[#ff4500]/10 border border-white/10 p-5 rounded-2xl relative flex flex-col justify-between hover:scale-[1.03] transition-transform duration-200"
              >
                {/* Visual burn status wrapper */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-[#ff4500] text-white px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-full">
                      PHASE {item.phase}
                    </span>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  <h4 className="font-display text-xl uppercase mb-2 text-white">{item.title}</h4>
                  <p className="font-sans text-xs text-zinc-400 leading-relaxed font-semibold">{item.description}</p>
                </div>

                <div className="mt-6 border-t border-white/15 pt-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border border-black ${
                      item.status === 'burned' ? 'bg-zinc-800 shadow-[0_0_8px_#111]' :
                      item.status === 'smoking' ? 'bg-[#ff4500] animate-pulse shadow-[0_0_8px_#ff4500]' :
                      'bg-orange-100'
                    }`}></span>
                    <span className="font-mono text-[9px] font-bold uppercase text-zinc-500">
                      BURN STATUS: {item.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick funny legal-looking badge */}
          <div className="mt-8 bg-neutral-900/40 text-zinc-400 border border-white/10 p-4 text-center font-mono text-[10px] uppercase leading-relaxed tracking-wider rounded-2xl">
            🚨 NOTE FOR COMPLIANCE DETECTIVES: We do not plan to write whitepapers. Lighter is fully functional. Digital ash belongs to purchasers.
          </div>
        </div>
      </section>

      {/* RECHARTED LIVE CHART & ORIGINAL POOL EMBED AT GECKOTERMINAL */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <div className="bg-zinc-950/90 border border-white/10 p-5 md:p-8 shadow-2xl rounded-3xl">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="bg-[#ff4500] text-white text-[10px] font-mono font-bold px-2.5 py-1 uppercase rounded-full">LIVE DEX DATA</span>
              <h3 className="font-display text-3xl uppercase text-white mt-1">CIG REALTIME CHART DECK</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={GECKOTERMINAL_URL}
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-white hover:bg-[#ff4500] hover:text-white text-black px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-md text-center"
              >
                GECKOTERMINAL POOL 🖥
              </a>
            </div>
          </div>

          {/* Chart Iframe box styled like CRT-Television screen with cigarette warning borders */}
          <div className="relative border-2 border-white/15 aspect-video w-full overflow-hidden bg-black rounded-2xl shadow-[0_4px_30px_rgba(255,69,0,0.15)]">
            <iframe 
              src={DEXSCREENER_EMBED_URL}
              className="absolute inset-0 w-full h-full border-0"
              title="CIG Solana Iframe Chart"
              referrerPolicy="no-referrer"
              allow="clipboard-write"
            ></iframe>
          </div>

          <div className="mt-5 text-center">
            <p className="font-mono text-[10px] tracking-tight uppercase text-zinc-500 font-bold">
              ⚡ LIVE DECENTRALIZED DATA PROXIED VIA DEXSCREENER • RETEST THE TREND LINE WHILE BLOWING SMOKE RINGS
            </p>
          </div>
        </div>
      </section>

      {/* FUNNY TESTIMONIALS SECTION - TO MAKE STORY EVEN MORE ENGAGING */}
      <section className="max-w-6xl mx-auto px-4 mt-16">
        <h3 className="font-display text-3xl md:text-5xl uppercase text-center text-white mb-10 tracking-tight">
          WHAT DEGENS SAY ABOUT $CIG 📢
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FUNNY_TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-neutral-900/60 border border-white/10 p-5 relative rounded-2xl flex flex-col justify-between shadow-xl">
              <div>
                <span className="text-4xl text-[#ff4500] font-serif leading-none absolute top-2 left-2 select-none opacity-40">“</span>
                <p className="font-mono text-xs italic text-zinc-200 leading-relaxed font-semibold pl-6 pt-2 mb-4">
                  {t.quote}
                </p>
              </div>
              <div className="border-t border-dashed border-white/10 pt-3 flex items-center gap-3">
                <img 
                  src={t.avatar} 
                  alt={t.user} 
                  className="w-10 h-10 rounded-full border border-white/10 object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div>
                  <h5 className="font-display text-xs uppercase text-white">{t.user}</h5>
                  <p className="text-[9px] font-mono font-bold uppercase text-zinc-500">Verified CIG Addict</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION & TOBACCO WARNING REPLICA BOX */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 text-center">
        
        {/* Giant classic white/black warning box styled label */}
        <div className="bg-black border-4 border-[#ff4500] text-white py-8 px-6 max-w-2xl mx-auto uppercase tracking-tighter leading-none mb-10 shadow-[0_0_30px_rgba(255,69,0,0.2)] rounded-3xl">
          <p className="font-mono text-xl sm:text-2xl md:text-3xl font-black mb-4 text-[#ff4500] neon-glow">CIGARETTES WARNING:</p>
          <div className="h-[2px] bg-white/20 w-full my-3"></div>
          <p className="font-sans text-sm sm:text-base font-bold leading-normal text-zinc-300 max-w-xl mx-auto">
            TRADING MEMECOINS CAUSES SEVERE EMOTIONAL SWINGS, DECREASED DESIRE TO GO OUTSIDE, AND UNCONTROLLED COUGHING OUTSIDE COFFEE SHOPS. $CIG CONTAINS 0% REAL TOBACCO AND IS ENTIRLY INLINE WITH BRAIN ROT MEME COMEDY. DO NOT ATTEMPT TO SMOKE YOUR COMPUTER WORKSTATION.
          </p>
        </div>

        {/* Mascot tiny signature link and copyright */}
        <div className="flex flex-col items-center gap-3">
          <img 
            src={MASCOT_IMAGE} 
            alt="Mini Ciggy logo" 
            className="w-10 h-10 rounded-full border border-white/10 object-cover"
            referrerPolicy="no-referrer"
          />
          <p className="font-mono text-[10px] md:text-xs text-[#ff4500] font-extrabold uppercase tracking-widest">
            © 2026 CIG ON SOLANA ($cig) • DESIGNED FOR THE HIGHEST CONCENTRATED TOBACCO FAITHFULS
          </p>
          <p className="font-mono text-[9px] text-[#8c8c8c] max-w-lg leading-relaxed">
            Disclaimer: $CIG is an educational/entertainment memecoin with exactly zero utility, zero underlying intrinsic value, and zero investment assurances. It exists strictly as an digital tribute to vintage cigarette character humor. Use lighters responsibly.
          </p>
        </div>

      </footer>

    </div>
  );
}
