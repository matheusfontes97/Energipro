"use client";

import { useState } from "react";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingPlansProps {
  onSelectPlan: (plan: "free" | "pro" | "premium") => void;
  currentPlan?: "free" | "pro" | "premium";
}

export default function PricingPlans({ onSelectPlan, currentPlan = "free" }: PricingPlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "premium">(currentPlan);

  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      icon: Zap,
      color: "from-gray-500 to-gray-600",
      borderColor: "border-gray-300",
      features: [
        "Até 3 contas por mês",
        "Gráficos básicos de consumo",
        "Quiz de identificação",
        "Análise mensal simples",
      ],
      limitations: [
        "Sem previsões avançadas",
        "Sem dicas personalizadas",
        "Sem suporte prioritário",
      ],
    },
    {
      id: "pro" as const,
      name: "Pro",
      price: "R$ 14,90",
      period: "/mês",
      icon: Crown,
      color: "from-blue-500 to-green-500",
      borderColor: "border-blue-400",
      popular: true,
      features: [
        "Upload ilimitado de contas",
        "Gráficos avançados e comparativos",
        "Previsões detalhadas de consumo",
        "Dicas personalizadas de economia",
        "Histórico completo",
        "Alertas de consumo elevado",
      ],
      limitations: [],
    },
    {
      id: "premium" as const,
      name: "Premium",
      price: "R$ 59,90",
      period: "/mês",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-400",
      features: [
        "Tudo do plano Pro",
        "Suporte prioritário 24/7",
        "Relatórios personalizados em PDF",
        "Integração com dispositivos IoT",
        "Monitoramento em tempo real",
        "Consultoria energética mensal",
        "API para desenvolvedores",
      ],
      limitations: [],
    },
  ];

  const handleSelectPlan = (planId: "free" | "pro" | "premium") => {
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Escolha seu Plano
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione o plano ideal para gerenciar sua energia de forma inteligente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isCurrent = currentPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-2xl ${
                  plan.popular ? "md:scale-105 shadow-xl" : "shadow-lg"
                } ${isSelected ? `border-2 ${plan.borderColor}` : "border border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-1 text-xs sm:text-sm">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className={`bg-gradient-to-br ${plan.color} p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg`}>
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-sm sm:text-base text-gray-600">{plan.period}</span>
                  </div>
                  {isCurrent && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      Plano Atual
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 sm:gap-3">
                        <div className={`bg-gradient-to-br ${plan.color} p-0.5 sm:p-1 rounded-full mt-0.5`}>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-700 flex-1">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full text-sm sm:text-base py-4 sm:py-5 md:py-6 ${
                      isSelected || plan.popular
                        ? `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {isCurrent ? "Plano Atual" : isSelected ? "Selecionado" : "Selecionar Plano"}
                  </Button>

                  {plan.id === "free" && (
                    <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-2">
                      Perfeito para começar
                    </p>
                  )}
                  {plan.id === "pro" && (
                    <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-2">
                      Ideal para controle completo
                    </p>
                  )}
                  {plan.id === "premium" && (
                    <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-2">
                      Máxima eficiência energética
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Todos os planos incluem acesso ao dashboard básico e suporte por email
          </p>
        </div>
      </div>
    </div>
  );
}
