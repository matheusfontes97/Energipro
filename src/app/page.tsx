"use client";

import { useState, useEffect } from "react";
import { Upload, TrendingUp, Zap, BarChart3, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthScreen from "./components/AuthScreen";
import LogoAnimation from "./components/LogoAnimation";
import Quiz from "./components/Quiz";
import Dashboard from "./components/Dashboard";
import BillUpload from "./components/BillUpload";
import PricingPlans from "./components/PricingPlans";

export interface Bill {
  id: string;
  month: string;
  consumption: number;
  value: number;
  imageUrl?: string;
  date: string;
}

export interface QuizData {
  completed: boolean;
  appliances: string[];
  houseSize: string;
  residents: number;
}

export type PlanType = "free" | "pro" | "premium";

type AppState = "auth" | "animation" | "quiz" | "app";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("auth");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [bills, setBills] = useState<Bill[]>([]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [currentPlan, setCurrentPlan] = useState<PlanType>("free");

  // Carregar dados do Local Storage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem("energipro_user");
    const storedBills = localStorage.getItem("energipro_bills");
    const storedQuiz = localStorage.getItem("energipro_quiz");
    const storedPlan = localStorage.getItem("energipro_plan");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Se já tem quiz completo, pular direto para o app
      if (storedQuiz) {
        const quiz = JSON.parse(storedQuiz);
        setQuizData(quiz);
        if (quiz.completed) {
          setAppState("app");
          if (storedBills) {
            setBills(JSON.parse(storedBills));
            setActiveTab("dashboard");
          }
        } else {
          setAppState("quiz");
        }
      } else {
        setAppState("quiz");
      }
    }

    if (storedPlan) {
      setCurrentPlan(storedPlan as PlanType);
    }
  }, []);

  // Salvar bills no Local Storage
  useEffect(() => {
    if (bills.length > 0) {
      localStorage.setItem("energipro_bills", JSON.stringify(bills));
    }
  }, [bills]);

  // Salvar plano no Local Storage
  useEffect(() => {
    localStorage.setItem("energipro_plan", currentPlan);
  }, [currentPlan]);

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
    setAppState("animation");
  };

  const handleAnimationComplete = () => {
    setAppState("quiz");
  };

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    localStorage.setItem("energipro_quiz", JSON.stringify(data));
    setAppState("app");
    setActiveTab("plans");
  };

  const handleBillsUpdate = (newBills: Bill[]) => {
    setBills(newBills);
    if (newBills.length > 0) {
      setActiveTab("dashboard");
    }
  };

  const handleSelectPlan = (plan: PlanType) => {
    setCurrentPlan(plan);
    setActiveTab("upload");
  };

  const handleLogout = () => {
    localStorage.removeItem("energipro_user");
    localStorage.removeItem("energipro_quiz");
    localStorage.removeItem("energipro_bills");
    localStorage.removeItem("energipro_plan");
    setUser(null);
    setQuizData(null);
    setBills([]);
    setAppState("auth");
  };

  // Verificar limites do plano
  const canUploadBill = () => {
    if (currentPlan === "free") {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const billsThisMonth = bills.filter((bill) => {
        const billDate = new Date(bill.date);
        return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
      });
      return billsThisMonth.length < 3;
    }
    return true; // Pro e Premium têm upload ilimitado
  };

  // Renderizar tela de autenticação
  if (appState === "auth") {
    return <AuthScreen onLogin={handleLogin} />;
  }

  // Renderizar animação do logo
  if (appState === "animation") {
    return <LogoAnimation onComplete={handleAnimationComplete} />;
  }

  // Renderizar quiz
  if (appState === "quiz") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        <Quiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  // Renderizar aplicação principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Energipro
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                  {user?.name} • <span className="font-semibold capitalize">{currentPlan}</span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 h-7 sm:h-8"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 md:mb-8 bg-white shadow-md h-auto">
            <TabsTrigger
              value="plans"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline sm:hidden">Upload</span>
              <span className="xs:hidden sm:inline">Contas</span>
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white text-xs sm:text-sm py-2 sm:py-2.5"
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline sm:hidden">Análise</span>
              <span className="xs:hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-0">
            <PricingPlans onSelectPlan={handleSelectPlan} currentPlan={currentPlan} />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            {!canUploadBill() && (
              <Card className="mb-4 border-orange-300 bg-orange-50">
                <CardContent className="pt-4 sm:pt-6">
                  <p className="text-xs sm:text-sm text-orange-800">
                    ⚠️ Você atingiu o limite de 3 contas por mês do plano Free.{" "}
                    <button
                      onClick={() => setActiveTab("plans")}
                      className="underline font-semibold hover:text-orange-900"
                    >
                      Faça upgrade para Pro ou Premium
                    </button>{" "}
                    para upload ilimitado.
                  </p>
                </CardContent>
              </Card>
            )}
            <BillUpload 
              bills={bills} 
              onBillsUpdate={handleBillsUpdate} 
              canUpload={canUploadBill()}
              currentPlan={currentPlan}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard bills={bills} quizData={quizData} currentPlan={currentPlan} />
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        {bills.length === 0 && activeTab === "upload" && canUploadBill() && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-blue-700">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  Upload Fácil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-gray-600">
                  Envie fotos das suas contas de energia
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  Análise Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-gray-600">
                  Calcule médias e previsões automaticamente
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2 text-blue-700">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Gráficos Visuais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-gray-600">
                  Visualize seu consumo com gráficos interativos
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
