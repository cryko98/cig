import { MemeImage, RoadmapItem, QuizQuestion, QuoteItem } from './types';

export const CONTRACT_ADDRESS = "cig9AXeEzQMUts9WXzmb8S5DapSVJ2b8JnrRmnWRdYz";
export const GECKOTERMINAL_URL = "https://www.geckoterminal.com/solana/pools/B5ihVH6qRkGTXhp61MZG5rRAmaCwtva3P2gRbZZrFU65";
export const TWITTER_URL = "https://x.com/cigonsolana?s=21";
export const DEXSCREENER_EMBED_URL = "https://dexscreener.com/solana/B5ihVH6qRkGTXhp61MZG5rRAmaCwtva3P2gRbZZrFU65?embed=1&theme=dark&trades=0&info=0";

export const MASCOT_IMAGE = "https://pbs.twimg.com/media/HJYrtwkaEAA8SX_?format=jpg&name=medium";

export const MEME_IMAGES: MemeImage[] = [
  {
    id: 1,
    url: "https://pbs.twimg.com/media/HJZKl-raUAAi3AY?format=jpg&name=medium",
    alt: "Ciggy meme - extreme cigarette motivation"
  },
  {
    id: 2,
    url: "https://pbs.twimg.com/media/HJZGLchakAAtkWZ?format=jpg&name=large",
    alt: "Ciggy meme - daily cigarette addiction lifestyle"
  },
  {
    id: 3,
    url: "https://pbs.twimg.com/media/HJZEvgvb0AADIa7?format=jpg&name=medium",
    alt: "Ciggy meme - professional smoke breaks"
  },
  {
    id: 4,
    url: "https://pbs.twimg.com/media/HJY9o-_bUAASYUO?format=jpg&name=medium",
    alt: "Ciggy meme - absolute mental focus"
  },
  {
    id: 5,
    url: "https://pbs.twimg.com/media/HJY4VyEWoAAThNY?format=jpg&name=medium",
    alt: "Ciggy meme - absolute masterpiece degen"
  },
  {
    id: 6,
    url: "https://pbs.twimg.com/media/HJY0zwOaUAABGXA?format=jpg&name=medium",
    alt: "Ciggy meme - cigarette in the wallet"
  },
  {
    id: 7,
    url: "https://pbs.twimg.com/media/HJYwIFQagAA9FXZ?format=jpg&name=large",
    alt: "Ciggy meme - original classic smoking posture"
  },
  {
    id: 8,
    url: "https://pbs.twimg.com/media/HJYrHapasAEwZLo?format=jpg&name=large",
    alt: "Ciggy meme - light up before reading charts"
  },
  {
    id: 9,
    url: "https://pbs.twimg.com/media/HJYpHJSaAAAPtJw?format=jpg&name=large",
    alt: "Ciggy meme - smoke in front of computer mouse"
  },
  {
    id: 10,
    url: "https://pbs.twimg.com/media/HJYmNXsbYAAHMcU?format=jpg&name=small",
    alt: "Ciggy meme - small cute cigarette looking funny"
  },
  {
    id: 11,
    url: "https://pbs.twimg.com/media/HJYJCQlbkAARZgg?format=jpg&name=large",
    alt: "Ciggy meme - legendary tobacco harvesting"
  },
  {
    id: 12,
    url: "https://pbs.twimg.com/media/HJX9URqWcAMin4j?format=jpg&name=large",
    alt: "Ciggy meme - pure gas pure smoke"
  }
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    phase: "01",
    title: "The Morning Spark",
    description: "Wake up at 2:00 PM in panic. Search wildly under 5 layers of empty pizza boxes for a lighter that actually has 1% gas left. Cough violently, take 1 deep breath, and buy more $cig.",
    status: "burned",
    icon: "⚡"
  },
  {
    phase: "02",
    title: "The Twitter Spitter",
    description: "Engage in 14-hour deep philosophical arguments with non-smoker anime profiles on X about the spiritual benefits of raw tobacco. Convert all family dynamic funds into $cig tokens.",
    status: "smoking",
    icon: "🚬"
  },
  {
    phase: "03",
    title: "Yellow Teeth Domination",
    description: "Launch a global lobby to officially change the Solana native gas token from SOL to CIG. Standardize the 'Decentralized 10-minute smoke break' as global labor law.",
    status: "unlit",
    icon: "🥇"
  },
  {
    phase: "04",
    title: "Nicotine Multiverse",
    description: "Ciggy achieves spiritual ascension, becoming the president of the decentralized internet. Oxygen is decommissioned; all browsers must consume $cig smoke to operate high speed loops.",
    status: "unlit",
    icon: "🌌"
  }
];

export const BUY_STEPS = [
  {
    step: "01",
    title: "Create a Wallet",
    description: "Install Phantom or Solflare on your browser or mobile phone. Store your seed phrase extremely securely – preferably on the back of a soggy cigarette pack.",
    color: "from-amber-400 to-orange-500"
  },
  {
    step: "02",
    title: "Acquire some SOL",
    description: "Convert fiat into SOL, or transfer SOL to your new wallet from your favorite crypto exchange. Yes, we are sacrificing this month's physical tobacco budget, it is for a greater cause.",
    color: "from-orange-500 to-red-500"
  },
  {
    step: "03",
    title: "Go to pump.fun",
    description: "Connect your wallet, and paste the glorious authentic CIG address: cig9AXeEzQMUts9WXzmb8S5DapSVJ2b8JnrRmnWRdYz into the search section. Do NOT touch any USB-rechargeable fruit vapes.",
    color: "from-red-500 to-rose-600"
  },
  {
    step: "04",
    title: "Swap SOL for $CIG",
    description: "Hit the buy button, set comfortable slippage, and enjoy being a proud digital tobacco tycoon. Your digital lungs are already glowing in beautifully rich gold shades!",
    color: "from-rose-600 to-amber-500"
  }
];

export const EXCUSE_DATABASE = [
  "My internet router blinked twice. That's a sign of high cosmic alignment.",
  "I just completed a 3-second task. Reward smoke incoming.",
  "I smelled fresh laundry and got incredibly terrified.",
  "Someone on X said that holding $CIG makes you have higher status.",
  "My coffee is too hot to drink, so I need to pass the time with Ciggy.",
  "The Solana gas price dipped by 0.0001 cents. Celebration time!",
  "My room is suspiciously smelling like fresh pine, this is unacceptable.",
  "I reached my 2-minute milestone of not checking the Dexscreener price.",
  "Doctor said my heart rate is perfect, meaning we have room for adventure.",
  "A wild cat stared at me through the window with distinct approval.",
  "I inhaled 1% oxygen, which throws off my biological equilibrium.",
  "My keyboard keys are dusty. Blowing the dust off requires maximum breath pressure.",
  "I have a major deadline in 8 minutes and I haven't started.",
  "I feel a gentle breeze, which would look spectacular interacting with a cloud of digital smoke."
];

export const PHYSICAL_WARNINGS = [
  "WARNING: TRADING $CIG CAUSES AN EXTREMELY HIGH DESIRE TO TELL OTHERS HOW COOL SMOKING LOOKED IN THE 1980s.",
  "WARNING: $CIG IS 100% ORGANIC DECENRALIZED DIGITAL TOBACCO. CONTAIN 0% FRUITY VAPE USB FLAVOR.",
  "WARNING: SMOKING THE CHARTS MAY RESULT IN MASSIVE WALLET HYPERTENSION AND TEMPORARY YELLOW TEETH IN METAVERSE.",
  "WARNING: SURGEON GENERAL HAS CONFIRMED THIS IS ULTRA-COMFY BRAIN ROT OF THE HIGHEST ORDER.",
  "WARNING: KEEP WALLET SEED PHRASES AWAY FROM REAL FIRE AND VINTAGE LIGHTERS AT ALL COST."
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "You wake up under extreme stress. Where is your lighter?",
    options: [
      { text: "In the drawer where it belongs.", points: 2 },
      { text: "Under my bed, buried under old tax documents.", points: 5 },
      { text: "I don't need a lighter, I use the kitchen toaster.", points: 10 },
      { text: "My lighter is physically taped to my hand for maximum reaction time.", points: 15 }
    ]
  },
  {
    id: 2,
    question: "What is your stance on fruity electronic USB vapes?",
    options: [
      { text: "They are convenient and smell like sweet mango.", points: 0 },
      { text: "They make me look like I'm sucking on a thumb drive.", points: 8 },
      { text: "I only inhale authentic, analog, dirty paper-wrapped digital gold.", points: 15 }
    ]
  },
  {
    id: 3,
    question: "How long can you watch a Dexscreener chart without smoking?",
    options: [
      { text: "A whole day easily. I am a machine.", points: 1 },
      { text: "Maybe for the first green candle (approx. 4 seconds).", points: 8 },
      { text: "I smoke TWO cigs simultaneously during 1-minute candle retests.", points: 15 }
    ]
  },
  {
    id: 4,
    question: "Your local doctor tells you that your lungs have 'interesting patterns'. Your response?",
    options: [
      { text: "Start drinking herbal tea and jog.", points: 1 },
      { text: "Argue that it represents a double-bottom chart pattern.", points: 10 },
      { text: "Tell the doctor to buy $cig for generational wealth.", points: 15 }
    ]
  }
];

export const FUNNY_TESTIMONIALS = [
  {
    quote: "Ever since I bought $CIG, I stopped coughing physical soot. Now my wallet coughs pure gold!",
    user: "Dave, 34 (Full-time Desk Sitter)",
    avatar: "https://pbs.twimg.com/media/HJY4VyEWoAAThNY?format=jpg&name=medium"
  },
  {
    quote: "My girlfriend complained about the smoke in our apartment. I swapped her for 50,000 $CIG. Life has never been so peaceful.",
    user: "Chad, 22 (Elite Gas Sniffer)",
    avatar: "https://pbs.twimg.com/media/HJZGlchakAAtkWZ?format=jpg&name=large"
  },
  {
    quote: "My doctor told me that fresh air is essential. But fresh air has 0% meme content. $CIG has 1000%. The choice was obvious.",
    user: "Granny Margit, 71 (Solana Whale)",
    avatar: "https://pbs.twimg.com/media/HJY9o-_bUAASYUO?format=jpg&name=medium"
  }
];
