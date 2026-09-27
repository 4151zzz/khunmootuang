import React, { useState } from 'react';
import { X, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/soundService';
import { OwnedPet } from '../../types';
import { PET_CATALOG } from '../../mockData';

interface EggHatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPetHatched: (pet: OwnedPet) => void;
  mascot: 'pig' | 'chicken';
}

export const EggHatchModal: React.FC<EggHatchModalProps> = ({
  isOpen,
  onClose,
  onPetHatched,
  mascot,
}) => {
  const [tapCount, setTapCount] = useState(0);
  const [isHatched, setIsHatched] = useState(false);
  const [hatchedPet, setHatchedPet] = useState<OwnedPet | null>(null);

  if (!isOpen) return null;

  const handleEggTap = () => {
    if (isHatched) return;

    const nextCount = tapCount + 1;
    setTapCount(nextCount);
    sound.playTap();

    if (nextCount >= 3) {
      // Hatch celebration!
      sound.playHatch();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Pick a random pet from catalog
      const randomIndex = Math.floor(Math.random() * PET_CATALOG.length);
      const chosen = PET_CATALOG[randomIndex];

      const newPet: OwnedPet = {
        id: `pet-${Date.now()}`,
        petId: chosen.petId,
        name: chosen.name,
        type: chosen.type,
        rarity: chosen.rarity as 'Common' | 'Rare' | 'Epic' | 'Legendary',
        level: 1,
        imageUrl: chosen.imageUrl,
        description: chosen.description,
        obtainedAt: new Date().toISOString().split('T')[0]
      };

      setHatchedPet(newPet);
      setIsHatched(true);
      onPetHatched(newPet);
    }
  };

  const handleResetOrClose = () => {
    setTapCount(0);
    setIsHatched(false);
    setHatchedPet(null);
    onClose();
  };

  // Egg visual stages
  const getEggGraphic = () => {
    if (tapCount === 0) return '🥚';
    if (tapCount === 1) return '🥚💥';
    if (tapCount === 2) return '🐣⚡';
    return '✨';
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 border-amber-300';
      case 'Epic':
        return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-400';
      case 'Rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400';
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-indigo-500/40 relative text-center overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleResetOrClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {!isHatched ? (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              ไข่สุ่มนำโชคคุณหมู
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-wide text-white">
              แตะที่ไข่เพื่อฟักตัวละคร!
            </h3>
            <p className="text-xs text-indigo-200 mt-1 mb-6">
              สะสมได้จากการส่งงานตรงเวลาและการมีส่วนร่วมในชั้นเรียน
            </p>

            {/* Egg Button */}
            <div className="py-6">
              <button
                onClick={handleEggTap}
                className="group relative cursor-pointer outline-none focus:scale-105 active:scale-95 transition-transform"
              >
                <div
                  className={`text-8xl select-none transition-all duration-200 ${
                    tapCount > 0 ? 'animate-wiggle scale-110' : 'hover:scale-105 animate-bounceSubtle'
                  }`}
                >
                  {getEggGraphic()}
                </div>

                {/* Tap Hint */}
                <div className="mt-4 inline-block bg-white/10 group-hover:bg-white/20 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full border border-white/20">
                  👆 เคาะอีก {3 - tapCount} ครั้ง!
                </div>
              </button>
            </div>

            {/* Tap progress dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all ${
                    tapCount > idx ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
              🎉 ฟักไข่สำเร็จแล้ว!
            </div>

            <h3 className="text-2xl font-black text-white mt-1">
              ยินดีด้วย! คุณได้รับคู่หูตัวใหม่
            </h3>

            {hatchedPet && (
              <div className="my-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                <div className="text-7xl mb-3 animate-bounceSubtle">{hatchedPet.imageUrl}</div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-sm ${getRarityBadgeColor(
                      hatchedPet.rarity
                    )}`}
                  >
                    ★ {hatchedPet.rarity}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-bold">
                    Lv. {hatchedPet.level}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-amber-300">{hatchedPet.name}</h4>
                <p className="text-xs text-indigo-100 mt-1 max-w-xs mx-auto leading-relaxed">
                  {hatchedPet.description}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleResetOrClose}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                เก็บเข้ากระเป๋าสัตว์เลี้ยง
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
