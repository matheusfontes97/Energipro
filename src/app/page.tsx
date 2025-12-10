"use client";

import { useState, useEffect } from "react";
import { Upload, TrendingUp, Zap, BarChart3, CreditCard, Check, Star, ArrowRight, Sparkles, Shield, Clock, TrendingDown, Award, AlertTriangle, DollarSign, Eye } from "lucide-react";
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

type AppState = "landing" | "auth" | "animation" | "quiz" | "app";

// Link de pagamento do plano Pro
const PRO_PAYMENT_LINK = "https://pay.kirvano.com/60a70fd0-4eb2-46ba-bf0d-bbec1be208ee";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
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
    if (plan === "pro") {
      // Redirecionar para o link de pagamento
      window.open(PRO_PAYMENT_LINK, "_blank");
    } else {
      setCurrentPlan(plan);
      setActiveTab("upload");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("energipro_user");
    localStorage.removeItem("energipro_quiz");
    localStorage.removeItem("energipro_bills");
    localStorage.removeItem("energipro_plan");
    setUser(null);
    setQuizData(null);
    setBills([]);
    setAppState("landing");
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
      return billsThisMonth.length < 2;
    }
    return true; // Pro e Premium têm upload ilimitado
  };

  // Renderizar Landing Page
  if (appState === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Header */}
        <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-blue-500/20 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  Energipro
                </h1>
              </div>
              <Button
                onClick={() => setAppState("auth")}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Começar Agora
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Economize até 40% na sua conta de luz</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
                Controle Sua Energia.<br />
                <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
                  Economize Dinheiro.
                </span>
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                A plataforma inteligente que analisa suas contas de energia e revela onde você está gastando demais. 
                <span className="text-green-400 font-semibold"> Tecnologia avançada para sua economia!</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button
                  onClick={() => setAppState("auth")}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110 group"
                >
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  onClick={() => {
                    const plansSection = document.getElementById('plans-section');
                    plansSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 font-semibold px-8 py-6 text-lg rounded-full"
                >
                  Ver Planos
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 px-4 bg-slate-800/50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">40%</div>
                <div className="text-gray-400">Economia Média</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">4.9★</div>
                <div className="text-gray-400">Avaliação</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Por Que Escolher o <span className="text-green-400">Energipro?</span>
              </h3>
              <p className="text-xl text-gray-300">Tecnologia de ponta para sua economia</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">Análise Inteligente</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    IA avançada analisa suas contas e identifica padrões de consumo, revelando oportunidades de economia que você nem imaginava.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <TrendingDown className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">Economia Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Usuários economizam em média 40% nas contas. Receba dicas personalizadas e veja seu dinheiro voltar para o bolso.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur hover:border-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">100% Seguro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Seus dados são criptografados e protegidos. Privacidade e segurança são nossa prioridade número um.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-orange-500/30 backdrop-blur hover:border-orange-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">Alertas em Tempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Receba notificações sobre bandeiras tarifárias e picos de consumo antes que sua conta exploda.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur hover:border-cyan-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Upload className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">Upload Simples</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Tire uma foto da sua conta e pronto! Nossa IA extrai todos os dados automaticamente em segundos.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-pink-500/30 backdrop-blur hover:border-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">Suporte Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    Equipe especializada pronta para ajudar você a economizar ainda mais. Atendimento rápido e eficiente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Por Que Você Precisa do App */}
        <section className="py-20 px-4 bg-slate-800/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Por Que Você <span className="text-red-400">Precisa</span> do Energipro?
              </h3>
              <p className="text-xl text-gray-300">Descubra os problemas que estamos resolvendo</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-slate-800/50 border-red-500/30 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Contas Altas Sem Explicação</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Você recebe contas de luz absurdas e não sabe o motivo? O Energipro identifica exatamente onde está o problema e como resolver.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-yellow-500/30 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Dinheiro Jogado Fora</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Aparelhos em standby, horários de pico, bandeiras tarifárias... Você está pagando mais do que deveria sem perceber!
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">Falta de Controle</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Sem visibilidade do seu consumo, você não tem como planejar ou economizar. O Energipro te dá controle total com dados claros.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-8 max-w-3xl mx-auto">
                <p className="text-xl md:text-2xl text-white font-semibold mb-4">
                  💡 A cada mês que passa sem controle, você está perdendo dinheiro!
                </p>
                <p className="text-gray-300 text-lg">
                  Pare de pagar contas altas sem saber o motivo. Comece agora e veja a diferença já no próximo mês.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="plans-section" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Escolha Seu Plano de <span className="text-green-400">Economia</span>
              </h3>
              <p className="text-xl text-gray-300">Invista pouco, economize muito. Os planos pagos oferecem análises mais profundas e recursos avançados para maximizar sua economia!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Gratuito</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-white">R$ 0</span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">2 contas por mês</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Análise básica</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Gráficos simples</span>
                  </div>
                  <Button
                    onClick={() => setAppState("auth")}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Começar Grátis
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="bg-gradient-to-br from-blue-600 to-green-600 border-0 backdrop-blur hover:scale-110 transition-all duration-300 shadow-2xl shadow-blue-500/50 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                  MAIS POPULAR
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Pro</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-white">R$ 14,90</span>
                    <span className="text-blue-100">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white font-medium">A partir de 3 contas ilimitadas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white font-medium">Análise avançada com IA</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white font-medium">Alertas de bandeira tarifária</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                    <span className="text-white font-medium">Previsões mensais</span>
                  </div>
                  <Button
                    onClick={() => window.open(PRO_PAYMENT_LINK, "_blank")}
                    className="w-full mt-6 bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-lg"
                  >
                    Assinar Pro
                  </Button>
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Premium</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-white">R$ 29,90</span>
                    <span className="text-gray-400">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Tudo do Pro +</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Dicas inteligentes personalizadas</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Notificações inteligentes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">Relatórios detalhados</span>
                  </div>
                  <Button
                    onClick={() => setAppState("auth")}
                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    Assinar Premium
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-400 text-sm">
                💳 Todos os planos com 7 dias de garantia. Não gostou? Devolvemos seu dinheiro.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pronto Para Economizar Centenas de Reais?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Comece agora e veja a diferença já no próximo mês com economia de até 40%
            </p>
            <Button
              onClick={() => setAppState("auth")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-12 py-6 text-xl rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              Começar Agora - É Grátis!
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
            <p className="text-blue-100 text-sm mt-6">
              ✓ Sem cartão de crédito • ✓ Cancele quando quiser • ✓ Suporte em português
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-slate-900 border-t border-slate-800">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">Energipro</span>
                </div>
                <p className="text-gray-400 text-sm">
                  A plataforma inteligente para economizar energia e dinheiro.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Produto</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
              <p>© 2024 Energipro. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

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
                    ⚠️ Você atingiu o limite de 2 contas por mês do plano Free.{" "}
                    <button
                      onClick={() => setActiveTab("plans")}
                      className="underline font-semibold hover:text-orange-900"
                    >
                      Faça upgrade para Pro ou Premium
                    </button>{" "}
                    para upload ilimitado a partir de 3 contas.
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
