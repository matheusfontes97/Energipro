"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Zap, Home as HomeIcon, Users, Lightbulb } from "lucide-react";
import { QuizData } from "../page";

interface QuizProps {
  onComplete: (data: QuizData) => void;
}

const appliances = [
  { id: "ac", label: "Ar Condicionado", icon: "❄️" },
  { id: "heater", label: "Aquecedor Elétrico", icon: "🔥" },
  { id: "fridge", label: "Geladeira", icon: "🧊" },
  { id: "washer", label: "Máquina de Lavar", icon: "🧺" },
  { id: "dryer", label: "Secadora", icon: "👕" },
  { id: "dishwasher", label: "Lava-Louças", icon: "🍽️" },
  { id: "oven", label: "Forno Elétrico", icon: "🍕" },
  { id: "microwave", label: "Micro-ondas", icon: "📦" },
  { id: "tv", label: "TV", icon: "📺" },
  { id: "computer", label: "Computador", icon: "💻" },
  { id: "shower", label: "Chuveiro Elétrico", icon: "🚿" },
  { id: "pool", label: "Bomba de Piscina", icon: "🏊" },
];

export default function Quiz({ onComplete }: QuizProps) {
  const [step, setStep] = useState(1);
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [houseSize, setHouseSize] = useState("");
  const [residents, setResidents] = useState("");

  const handleApplianceToggle = (applianceId: string) => {
    setSelectedAppliances((prev) =>
      prev.includes(applianceId)
        ? prev.filter((id) => id !== applianceId)
        : [...prev, applianceId]
    );
  };

  const handleComplete = () => {
    const quizData: QuizData = {
      completed: true,
      appliances: selectedAppliances,
      houseSize,
      residents: parseInt(residents) || 1,
    };
    onComplete(quizData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-blue-200 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-4 rounded-2xl shadow-lg">
              <Zap className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Bem-vindo ao Energipro
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            Vamos conhecer melhor sua casa para calcular previsões mais precisas
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 sm:w-24 rounded-full transition-all ${
                  s <= step
                    ? "bg-gradient-to-r from-blue-500 to-green-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Appliances */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Quais aparelhos você possui?
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Selecione todos os aparelhos que você tem em casa
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2">
                {appliances.map((appliance) => (
                  <div
                    key={appliance.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      selectedAppliances.includes(appliance.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => handleApplianceToggle(appliance.id)}
                  >
                    <Checkbox
                      id={appliance.id}
                      checked={selectedAppliances.includes(appliance.id)}
                      onCheckedChange={() => handleApplianceToggle(appliance.id)}
                    />
                    <Label
                      htmlFor={appliance.id}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <span className="text-xl">{appliance.icon}</span>
                      <span className="hidden sm:inline">{appliance.label}</span>
                      <span className="sm:hidden text-xs">{appliance.label.split(" ")[0]}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: House Size */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <HomeIcon className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Qual o tamanho da sua casa?
                </h3>
              </div>
              <RadioGroup value={houseSize} onValueChange={setHouseSize}>
                <div className="space-y-3">
                  {[
                    { value: "small", label: "Pequena (até 70m²)", icon: "🏠" },
                    { value: "medium", label: "Média (70-150m²)", icon: "🏡" },
                    { value: "large", label: "Grande (150-300m²)", icon: "🏘️" },
                    { value: "xlarge", label: "Muito Grande (300m²+)", icon: "🏰" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        houseSize === option.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                      onClick={() => setHouseSize(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-base">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Residents */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Quantas pessoas moram na casa?
                </h3>
              </div>
              <RadioGroup value={residents} onValueChange={setResidents}>
                <div className="space-y-3">
                  {[
                    { value: "1", label: "1 pessoa", icon: "👤" },
                    { value: "2", label: "2 pessoas", icon: "👥" },
                    { value: "3", label: "3 pessoas", icon: "👨‍👩‍👦" },
                    { value: "4", label: "4 pessoas", icon: "👨‍👩‍👧‍👦" },
                    { value: "5", label: "5+ pessoas", icon: "👨‍👩‍👧‍👧" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                        residents === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                      onClick={() => setResidents(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={`residents-${option.value}`} />
                      <Label
                        htmlFor={`residents-${option.value}`}
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-base">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && selectedAppliances.length === 0) ||
                  (step === 2 && !houseSize)
                }
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Próximo
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!residents}
                className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Começar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
