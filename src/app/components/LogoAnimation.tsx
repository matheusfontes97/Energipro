"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface LogoAnimationProps {
  onComplete: () => void;
}

export default function LogoAnimation({ onComplete }: LogoAnimationProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Animação de batimento do coração
    let count = 0;
    const maxBeats = 6; // 3 batimentos completos (6 pulsos)
    
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.2 : 1));
      count++;
      
      if (count >= maxBeats) {
        clearInterval(interval);
        // Aguardar um pouco antes de completar
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 400); // Batimento a cada 400ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 flex items-center justify-center">
      <div className="text-center">
        {/* Logo com animação de batimento */}
        <div
          className="inline-flex items-center justify-center bg-white p-8 rounded-3xl shadow-2xl mb-6 transition-transform duration-300 ease-in-out"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <Zap className="w-24 h-24 text-blue-600" />
        </div>
        
        <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
          Energipro
        </h1>
        
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
}
