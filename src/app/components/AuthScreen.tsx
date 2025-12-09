"use client";

import { useState } from "react";
import { Mail, Lock, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthScreenProps {
  onLogin: (email: string, name: string) => void;
}

export default function AuthScreen({ onLogin }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    if (!isLogin && !name) {
      setError("Preencha seu nome");
      return;
    }

    // Validar formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido");
      return;
    }

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    // Simular autenticação (em produção, conectar com backend)
    const userData = {
      email,
      name: isLogin ? email.split("@")[0] : name,
    };

    // Salvar no localStorage
    localStorage.setItem("energipro_user", JSON.stringify(userData));
    
    // Chamar callback de login
    onLogin(userData.email, userData.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo animado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-2xl shadow-2xl mb-4">
            <Zap className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Energipro</h1>
          <p className="text-blue-100">Gerencie sua energia de forma inteligente</p>
        </div>

        {/* Card de autenticação */}
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Entrar" : "Criar Conta"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Entre com seu e-mail e senha"
                : "Crie sua conta para começar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-6"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin
                    ? "Não tem conta? Cadastre-se"
                    : "Já tem conta? Entre"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
