"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, DollarSign, Calendar, AlertTriangle, Lightbulb, Crown, Sparkles, Lock } from "lucide-react";
import { Bill, QuizData, PlanType } from "../page";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DashboardProps {
  bills: Bill[];
  quizData: QuizData | null;
  currentPlan: PlanType;
}

export default function Dashboard({ bills, quizData, currentPlan }: DashboardProps) {
  const isPro = currentPlan === "pro";
  const isPremium = currentPlan === "premium";
  const hasAdvancedFeatures = isPro || isPremium;

  if (bills.length === 0) {
    return (
      <Card className="border-blue-200 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-blue-700 text-base sm:text-lg md:text-xl">Dashboard</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Adicione contas para ver suas análises</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-500">Nenhuma conta adicionada ainda</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Cálculos
  const sortedBills = [...bills].sort((a, b) => a.month.localeCompare(b.month));
  
  const totalConsumption = bills.reduce((sum, bill) => sum + bill.consumption, 0);
  const totalValue = bills.reduce((sum, bill) => sum + bill.value, 0);
  const avgConsumption = totalConsumption / bills.length;
  const avgValue = totalValue / bills.length;
  
  // Previsão simples (média + 5% de crescimento)
  const predictedConsumption = avgConsumption * 1.05;
  const predictedValue = avgValue * 1.05;
  
  // Tendência
  const firstBill = sortedBills[0];
  const lastBill = sortedBills[sortedBills.length - 1];
  const consumptionTrend = lastBill.consumption > firstBill.consumption ? "up" : "down";
  const valueTrend = lastBill.value > firstBill.value ? "up" : "down";
  
  // Dados para gráficos
  const chartData = sortedBills.map((bill) => ({
    month: new Date(bill.month + "-01").toLocaleDateString("pt-BR", { month: "short" }),
    consumption: bill.consumption,
    value: bill.value,
  }));
  
  // Adicionar previsão ao gráfico (apenas para Pro/Premium)
  const chartDataWithPrediction = hasAdvancedFeatures ? [
    ...chartData,
    {
      month: "Previsão",
      consumption: predictedConsumption,
      value: predictedValue,
      isPrediction: true,
    },
  ] : chartData;

  // Dicas baseadas no quiz
  const getTips = () => {
    const tips = [];
    
    if (quizData?.appliances.includes("ac")) {
      tips.push("Ar condicionado: Use temperatura entre 23-24°C e limpe os filtros mensalmente");
    }
    if (quizData?.appliances.includes("shower")) {
      tips.push("Chuveiro elétrico: Reduza o tempo de banho em 2-3 minutos para economizar até 20%");
    }
    if (quizData?.appliances.includes("fridge")) {
      tips.push("Geladeira: Mantenha a borracha da porta em bom estado e evite abrir desnecessariamente");
    }
    if (quizData?.appliances.includes("washer")) {
      tips.push("Máquina de lavar: Use sempre com carga completa e prefira água fria");
    }
    
    if (tips.length === 0) {
      tips.push("Desligue aparelhos da tomada quando não estiver usando");
      tips.push("Troque lâmpadas por LED para economizar até 80% de energia");
    }
    
    return tips;
  };

  const getPersonalizedTips = () => {
    if (!hasAdvancedFeatures) return [];
    
    const personalizedTips = [];
    
    if (consumptionTrend === "up") {
      personalizedTips.push("⚠️ Seu consumo está aumentando! Revise o uso de aparelhos de alto consumo.");
    }
    
    if (avgConsumption > 400) {
      personalizedTips.push("💡 Seu consumo está acima da média. Considere investir em aparelhos mais eficientes.");
    }
    
    if (quizData?.residents && avgConsumption / quizData.residents > 150) {
      personalizedTips.push("👥 Consumo per capita elevado. Incentive economia de energia entre os moradores.");
    }
    
    return personalizedTips;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Plan Badge */}
      <div className="flex justify-end">
        <Badge className={`${
          isPremium ? "bg-gradient-to-r from-purple-500 to-pink-500" :
          isPro ? "bg-gradient-to-r from-blue-500 to-green-500" :
          "bg-gray-500"
        } text-white px-3 py-1 text-xs sm:text-sm`}>
          {isPremium && <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
          {isPro && <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
          Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium text-blue-700 flex items-center gap-1 sm:gap-2">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Consumo Médio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">{avgConsumption.toFixed(0)} kWh</div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-blue-600 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
              {consumptionTrend === "up" ? (
                <>
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">Tendência alta</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">Tendência baixa</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium text-green-700 flex items-center gap-1 sm:gap-2">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Valor Médio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-900">R$ {avgValue.toFixed(2)}</div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-green-600 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1">
              {valueTrend === "up" ? (
                <>
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">Tendência alta</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span className="truncate">Tendência baixa</span>
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-purple-200 ${hasAdvancedFeatures ? "bg-gradient-to-br from-purple-50 to-purple-100" : "bg-gray-100 relative"}`}>
          {!hasAdvancedFeatures && (
            <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            </div>
          )}
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium text-purple-700 flex items-center gap-1 sm:gap-2">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Previsão Consumo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900">
              {hasAdvancedFeatures ? `${predictedConsumption.toFixed(0)} kWh` : "---"}
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-purple-600 mt-0.5 sm:mt-1 truncate">
              {hasAdvancedFeatures ? "Próximo mês" : "Pro/Premium"}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-orange-200 ${hasAdvancedFeatures ? "bg-gradient-to-br from-orange-50 to-orange-100" : "bg-gray-100 relative"}`}>
          {!hasAdvancedFeatures && (
            <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
            </div>
          )}
          <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 pt-3 sm:pt-4">
            <CardTitle className="text-[10px] sm:text-xs md:text-sm font-medium text-orange-700 flex items-center gap-1 sm:gap-2">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">Previsão Valor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900">
              {hasAdvancedFeatures ? `R$ ${predictedValue.toFixed(2)}` : "---"}
            </div>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-orange-600 mt-0.5 sm:mt-1 truncate">
              {hasAdvancedFeatures ? "Próximo mês" : "Pro/Premium"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Consumption Chart */}
        <Card className="border-blue-200 shadow-lg bg-white">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-blue-700 flex items-center gap-2 text-sm sm:text-base md:text-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              Consumo Mensal (kWh)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {hasAdvancedFeatures ? "Histórico e previsão de consumo" : "Histórico de consumo"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartDataWithPrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 9 }} />
                <YAxis stroke="#666" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #3b82f6",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 3 }}
                  name="Consumo (kWh)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Value Chart */}
        <Card className="border-green-200 shadow-lg bg-white">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-green-700 flex items-center gap-2 text-sm sm:text-base md:text-lg">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              Valor Mensal (R$)
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {hasAdvancedFeatures ? "Histórico e previsão de valores" : "Histórico de valores"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartDataWithPrediction}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 9 }} />
                <YAxis stroke="#666" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #10b981",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "10px" }} />
                <Bar dataKey="value" fill="#10b981" name="Valor (R$)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Tips (Pro/Premium only) */}
      {hasAdvancedFeatures && getPersonalizedTips().length > 0 && (
        <Card className="border-purple-200 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-purple-700 flex items-center gap-2 text-sm sm:text-base md:text-lg">
              {isPremium ? <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> : <Crown className="w-4 h-4 sm:w-5 sm:h-5" />}
              Dicas Personalizadas
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Exclusivo para {isPremium ? "Premium" : "Pro"}</CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2 sm:space-y-3">
              {getPersonalizedTips().map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-purple-200"
                >
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Tips */}
      <Card className="border-yellow-200 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-orange-700 flex items-center gap-2 text-sm sm:text-base md:text-lg">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
            Dicas de Economia
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Baseado nos seus aparelhos</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3">
            {getTips().map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-yellow-200"
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-blue-200 shadow-lg bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-blue-700 text-sm sm:text-base md:text-lg">Resumo da Análise</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
            <p>
              📊 Você adicionou <strong>{bills.length} conta(s)</strong> de energia
            </p>
            <p>
              ⚡ Seu consumo médio é de <strong>{avgConsumption.toFixed(0)} kWh</strong> por mês
            </p>
            <p>
              💰 Seu gasto médio é de <strong>R$ {avgValue.toFixed(2)}</strong> por mês
            </p>
            {hasAdvancedFeatures && (
              <p>
                📈 Para o próximo mês, prevemos um consumo de{" "}
                <strong>{predictedConsumption.toFixed(0)} kWh</strong> e um valor de{" "}
                <strong>R$ {predictedValue.toFixed(2)}</strong>
              </p>
            )}
            {quizData && (
              <p>
                🏠 Sua casa tem <strong>{quizData.residents} pessoa(s)</strong> e você possui{" "}
                <strong>{quizData.appliances.length} aparelho(s)</strong> cadastrados
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
