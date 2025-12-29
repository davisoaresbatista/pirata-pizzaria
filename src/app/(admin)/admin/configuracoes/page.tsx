"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Sun, Moon } from "lucide-react";

interface ShiftConfig {
  id: string;
  name: string;
  description: string;
  value: number;
}

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState<ShiftConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchConfigs = async () => {
    try {
      const response = await fetch("/api/shift-config");
      if (response.ok) {
        const data = await response.json();
        setConfigs(data);
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleValueChange = (name: string, value: string) => {
    setConfigs((prev) =>
      prev.map((c) =>
        c.name === name ? { ...c, value: parseFloat(value) || 0 } : c
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/shift-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs }),
      });

      if (response.ok) {
        alert("Configurações salvas com sucesso!");
      } else {
        alert("Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (name: string) => {
    if (name === "lunch") return <Sun className="h-5 w-5 text-amber-500" />;
    return <Moon className="h-5 w-5 text-blue-500" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Configure os valores por turno
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {configs.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {getIcon(config.name)}
                <div>
                  <CardTitle className="text-lg">{config.description}</CardTitle>
                  <CardDescription>
                    Valor atual: {formatCurrency(config.value)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={config.name}>Valor (R$)</Label>
                <Input
                  id={config.name}
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.value}
                  onChange={(e) => handleValueChange(config.name, e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo de Valores</CardTitle>
          <CardDescription>
            Como os valores são calculados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold">Almoço</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Valor fixo para todos os dias da semana.
              </p>
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(configs.find((c) => c.name === "lunch")?.value || 0)}
              </p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Jantar (Segunda a Sexta)</h3>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(configs.find((c) => c.name === "dinner_weekday")?.value || 0)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">Jantar (Sábado e Domingo)</h3>
                </div>
                <p className="text-2xl font-bold">
                  {formatCurrency(configs.find((c) => c.name === "dinner_weekend")?.value || 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

