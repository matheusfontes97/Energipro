"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type TariffFlag = "verde" | "amarela" | "vermelha-1" | "vermelha-2";

interface TariffAlertProps {
  className?: string;
}

export default function TariffAlert({ className = "" }: TariffAlertProps) {
  const [currentFlag, setCurrentFlag] = useState<TariffFlag>("verde");

  // Simular mudança de bandeira (em produção, isso viria de uma API do governo)
  useEffect(() => {
    // Aqui você pode integrar com API real do governo
    // Por enquanto, vamos usar uma simulação baseada no mês
    const month = new Date().getMonth();
    
    // Simulação: meses de verão (dez-fev) tendem a ter bandeiras mais altas
    if (month >= 11 || month <= 1) {
      setCurrentFlag("vermelha-2");
    } else if (month >= 2 && month <= 4) {
      setCurrentFlag("vermelha-1");
    } else if (month >= 5 && month <= 7) {
      setCurrentFlag("amarela");
    } else {
      setCurrentFlag("verde");
    }
  }, []);

  const flagConfig = {
    verde: {
      color: "bg-green-500",
      borderColor: "border-green-300",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      title: "Bandeira Verde",
      description: "Condições favoráveis de geração de energia. Não há acréscimo na tarifa.",
      icon: "✓",
      additionalCost: "R$ 0,00"
    },
    amarela: {
      color: "bg-yellow-500",
      borderColor: "border-yellow-300",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      title: "Bandeira Amarela",
      description: "Condições de geração menos favoráveis. Acréscimo na tarifa.",
      icon: "⚠",
      additionalCost: "R$ 2,99 por 100 kWh"
    },
    "vermelha-1": {
      color: "bg-red-500",
      borderColor: "border-red-300",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      title: "Bandeira Vermelha - Patamar 1",
      description: "Condições mais custosas de geração. Acréscimo significativo na tarifa.",
      icon: "⚠",
      additionalCost: "R$ 6,50 por 100 kWh"
    },
    "vermelha-2": {
      color: "bg-red-700",
      borderColor: "border-red-400",
      bgColor: "bg-red-100",
      textColor: "text-red-900",
      title: "Bandeira Vermelha - Patamar 2",
      description: "Condições críticas de geração. Maior acréscimo na tarifa.",
      icon: "🚨",
      additionalCost: "R$ 9,79 por 100 kWh"
    }
  };

  const config = flagConfig[currentFlag];

  return (
    <Card className={`${config.borderColor} ${config.bgColor} border-2 ${className}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Flag Icon */}
          <div className={`${config.color} p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 shadow-lg`}>
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <h3 className={`text-sm sm:text-base md:text-lg font-bold ${config.textColor}`}>
                {config.title}
              </h3>
              <span className="text-lg sm:text-xl">{config.icon}</span>
            </div>
            
            <p className={`text-xs sm:text-sm ${config.textColor} mb-2 sm:mb-3`}>
              {config.description}
            </p>

            <div className={`inline-flex items-center gap-2 ${config.color} text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold`}>
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Custo adicional: {config.additionalCost}</span>
            </div>

            {/* Dicas de economia */}
            {currentFlag !== "verde" && (
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/50 rounded-lg border border-gray-200">
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  💡 Dicas para economizar:
                </p>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-0.5 sm:space-y-1 list-disc list-inside">
                  <li>Evite usar aparelhos de alto consumo nos horários de pico (18h-21h)</li>
                  <li>Desligue equipamentos em stand-by</li>
                  <li>Use iluminação natural sempre que possível</li>
                  {currentFlag.includes("vermelha") && (
                    <li className="font-semibold">Reduza o uso de ar-condicionado e chuveiro elétrico</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
