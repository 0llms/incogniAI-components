"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Crown, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { ShareCardModal } from "./ShareCardModal";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  days: number;
  label: string;
  gradient: string;
}

const CARDS: Card[] = [
  { id: "c1", days: 30, label: "Days", gradient: "from-blue-600 to-indigo-600" },
  { id: "c2", days: 365, label: "Days", gradient: "from-zinc-400 to-zinc-600" },
  { id: "c3", days: 3, label: "Days", gradient: "from-teal-400 to-cyan-500" },
  { id: "c4", days: 7, label: "Days", gradient: "from-sky-400 to-blue-500" },
  { id: "c5", days: 15, label: "Days", gradient: "from-purple-500 to-indigo-500" },
];

export function InviteModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [drawsAvailable, setDrawsAvailable] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonCard, setWonCard] = useState<Card | null>(null);
  
  // Animation state for shuffle
  const [activeIndex, setActiveIndex] = useState(2); // Center card

  useEffect(() => {
    const savedDraws = localStorage.getItem('incogni_draws');
    if (savedDraws !== null) {
      setDrawsAvailable(parseInt(savedDraws, 10));
    }
  }, []);

  const handleDraw = () => {
    if (drawsAvailable <= 0 || isSpinning) return;
    
    setIsSpinning(true);
    const newDraws = drawsAvailable - 1;
    setDrawsAvailable(newDraws);
    localStorage.setItem('incogni_draws', newDraws.toString());
    setWonCard(null);

    // Shuffle animation loop
    let spins = 0;
    const maxSpins = 20; // total number of card jumps
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CARDS.length);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval);
        // Pick a random winner, weighted towards smaller days for realism, but let's just pick random
        const winnerIdx = Math.floor(Math.random() * CARDS.length);
        setActiveIndex(winnerIdx);
        setTimeout(() => {
          setWonCard(CARDS[winnerIdx]);
          setIsSpinning(false);
        }, 500);
      }
    }, 150); // Speed of spin
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black font-sans">
      <div className="relative w-full h-full flex flex-col bg-[#0a0a0c] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="text-center pt-16 pb-8 z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-medium text-white tracking-tight">IncogniAI Friends</h2>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-500/30">Beta</span>
          </div>
          <p className="text-white/60 text-sm">Invite friends to IncogniAI for guaranteed Membership Credits</p>
        </div>

        {/* Cards Stage */}
        <div className="relative flex-1 flex items-center justify-center perspective-[1000px] mb-12">
          
          <div className="relative w-full max-w-3xl h-64 flex justify-center items-center">
            {CARDS.map((card, i) => {
              // Calculate semi-circle positions
              const isCenter = i === 2;
              const offset = i - 2; // -2, -1, 0, 1, 2
              const angle = offset * 25; // spread angle
              const translateY = Math.abs(offset) * 30; // arch effect
              const translateZ = Math.abs(offset) * -50; // depth
              
              const isHighlighted = isSpinning ? i === activeIndex : wonCard?.id === card.id;

              return (
                <motion.div
                  key={card.id}
                  className={cn(
                    "absolute w-48 h-32 rounded-xl border border-white/20 p-4 flex flex-col justify-between overflow-hidden cursor-default transition-all duration-300",
                    isHighlighted ? "shadow-[0_0_40px_rgba(255,255,255,0.2)] z-50 scale-110" : "opacity-70 grayscale-[30%]"
                  )}
                  initial={{ rotate: angle, y: translateY, z: translateZ, x: offset * 120 }}
                  animate={{ 
                    rotate: wonCard ? (wonCard.id === card.id ? 0 : angle) : angle,
                    y: wonCard ? (wonCard.id === card.id ? -40 : translateY + 100) : translateY,
                    z: wonCard ? (wonCard.id === card.id ? 100 : translateZ - 100) : translateZ,
                    x: wonCard ? (wonCard.id === card.id ? 0 : offset * 180) : offset * 120,
                    opacity: wonCard ? (wonCard.id === card.id ? 1 : 0) : (isHighlighted ? 1 : 0.7),
                    scale: isHighlighted ? (wonCard ? 1.4 : 1.1) : 1
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80", card.gradient)} />
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                  
                  <div className="relative z-10 flex justify-between items-start w-full">
                    <span className="text-[10px] font-bold tracking-widest text-white/80 uppercase">IncogniAI<br/>Credits</span>
                    <span className="text-white/40"><Crown className="h-4 w-4" /></span>
                  </div>
                  
                  <div className="relative z-10 flex items-baseline gap-1 self-end">
                    <span className="text-4xl font-bold text-white drop-shadow-md">{card.days}</span>
                    <span className="text-sm font-medium text-white/80 drop-shadow-md">{card.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Central Draw Action */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            {wonCard ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <p className="text-green-400 font-medium text-lg mb-2">You won {wonCard.days} Days of Ultra!</p>
                <p className="text-sm text-white/60">Credits have been applied to your account.</p>
              </motion.div>
            ) : (
              <>
                <p className="text-white font-medium">{CARDS[2].days}-Day Membership Credits</p>
                <button 
                  onClick={handleDraw}
                  disabled={drawsAvailable <= 0 || isSpinning}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSpinning ? <RotateCcw className="h-4 w-4 animate-spin" /> : null}
                  {drawsAvailable > 0 ? "Draw a Reward" : "0 Draws Available"}
                </button>
                <p className="text-white/40 text-xs">My Prizes &gt;</p>
              </>
            )}
          </div>
        </div>

        {/* Task Footer */}
        <div className="mt-auto border-t border-white/10 p-6 bg-white/[0.02]">
          <p className="text-center text-white/60 text-sm mb-4">Complete any task below, and both of you get [ 1 ] draw.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {/* Task 1 */}
            <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-between gap-4 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-3">
                <UserPlus className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-medium">Invite a friend to join IncogniAI</h4>
                  <p className="text-white/40 text-xs mt-1">Get 1 draw when a new user signs up.</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setShareModalOpen(true)} className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-colors">
                  Invite
                </button>
              </div>
            </div>

            {/* Task 2 */}
            <div className="bg-white/5 rounded-xl p-4 flex flex-col justify-between gap-4 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-3">
                <Crown className="h-5 w-5 text-white/60 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-medium">Invite a new friend to subscribe</h4>
                  <p className="text-white/40 text-xs mt-1">Both of you get the exact same membership tier!</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setShareModalOpen(true)} className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-colors">
                  Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {shareModalOpen && <ShareCardModal onClose={() => setShareModalOpen(false)} user={user} />}
    </div>
  );
}
