"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, X, FileText, Calendar } from "lucide-react";
import { Bill, PlanType } from "../page";

interface BillUploadProps {
  bills: Bill[];
  onBillsUpdate: (bills: Bill[]) => void;
  canUpload: boolean;
  currentPlan: PlanType;
}

export default function BillUpload({ bills, onBillsUpdate, canUpload, currentPlan }: BillUploadProps) {
  const [month, setMonth] = useState("");
  const [consumption, setConsumption] = useState("");
  const [value, setValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!month || !consumption || !value) {
      alert("Por favor, preencha todos os campos");
      return;
    }

    if (!canUpload) {
      alert("Você atingiu o limite do seu plano. Faça upgrade para continuar.");
      return;
    }

    const newBill: Bill = {
      id: Date.now().toString(),
      month,
      consumption: parseFloat(consumption),
      value: parseFloat(value),
      imageUrl: imagePreview || undefined,
      date: new Date().toISOString(),
    };

    onBillsUpdate([...bills, newBill]);
    
    // Reset form
    setMonth("");
    setConsumption("");
    setValue("");
    setImagePreview(null);
  };

  const handleRemoveBill = (id: string) => {
    onBillsUpdate(bills.filter((bill) => bill.id !== id));
  };

  const getUploadLimit = () => {
    if (currentPlan === "free") return "3 contas/mês";
    return "Ilimitado";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Upload Form */}
      <Card className="border-blue-200 shadow-lg bg-white">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-700 text-base sm:text-lg md:text-xl">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            Adicionar Conta de Energia
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Limite do plano {currentPlan}: {getUploadLimit()}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Image Upload */}
            <div className="space-y-2 sm:space-y-3">
              <Label className="text-xs sm:text-sm">Foto da Conta (Opcional)</Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 sm:h-24 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <span className="text-[10px] sm:text-xs md:text-sm">Upload</span>
                    </div>
                  </Button>
                </div>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                    id="camera-capture"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 sm:h-24 border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-50"
                    onClick={() => document.getElementById("camera-capture")?.click()}
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      <span className="text-[10px] sm:text-xs md:text-sm">Câmera</span>
                    </div>
                  </Button>
                </div>
              </div>

              {imagePreview && (
                <div className="relative mt-2 sm:mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 sm:h-48 object-cover rounded-lg border-2 border-blue-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8"
                    onClick={() => setImagePreview(null)}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Month */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="month" className="text-xs sm:text-sm">Mês/Ano da Conta</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Ex: 2024-01"
                className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Consumption */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="consumption" className="text-xs sm:text-sm">Consumo (kWh)</Label>
              <Input
                id="consumption"
                type="number"
                step="0.01"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                placeholder="Ex: 350"
                className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
              />
            </div>

            {/* Value */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="value" className="text-xs sm:text-sm">Valor Total (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ex: 285.50"
                className="border-blue-200 focus:border-blue-500 h-9 sm:h-10 text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 h-9 sm:h-10 text-xs sm:text-sm"
              disabled={!canUpload}
            >
              {canUpload ? "Adicionar Conta" : "Limite Atingido - Faça Upgrade"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bills List */}
      {bills.length > 0 && (
        <Card className="border-green-200 shadow-lg bg-white">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-green-700 text-base sm:text-lg md:text-xl">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              Contas Adicionadas
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-2 sm:space-y-3">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200"
                >
                  {bill.imageUrl && (
                    <img
                      src={bill.imageUrl}
                      alt={`Conta ${bill.month}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover rounded-lg border-2 border-blue-300 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base truncate">
                        {new Date(bill.month + "-01").toLocaleDateString("pt-BR", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                      Consumo: <span className="font-semibold text-blue-600">{bill.consumption} kWh</span>
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                      Valor: <span className="font-semibold text-green-600">R$ {bill.value.toFixed(2)}</span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBill(bill.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 flex-shrink-0"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
