import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  // Dados de exemplo - em produção virão do banco de dados
  const stats = {
    totalEmployees: 8,
    activeEmployees: 7,
    pendingAdvances: 3,
    totalAdvancesPending: 1500,
    monthlyRevenue: 45000,
    monthlyExpenses: 28000,
  };

  const profit = stats.monthlyRevenue - stats.monthlyExpenses;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da Pirata Pizzaria
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalEmployees} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Adiantamentos Pendentes
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAdvances}</div>
            <p className="text-xs text-muted-foreground">
              R$ {stats.totalAdvancesPending.toLocaleString("pt-BR")} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats.monthlyRevenue.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Despesas do Mês
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {stats.monthlyExpenses.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground">
              -5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Lucro */}
        <Card className={profit >= 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Resultado do Mês
            </CardTitle>
            <DollarSign className={`h-4 w-4 ${profit >= 0 ? "text-green-600" : "text-red-600"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${profit >= 0 ? "text-green-700" : "text-red-700"}`}>
              R$ {profit.toLocaleString("pt-BR")}
            </div>
            <p className={`text-sm ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {profit >= 0 ? "Lucro" : "Prejuízo"} no período
            </p>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ações Pendentes
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                3 adiantamentos aguardando aprovação
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Folha de pagamento de dezembro pendente
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                2 despesas para registrar
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="bg-secondary/50">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Dica:</strong> Use o menu lateral para navegar entre as seções.
            Cadastre seus funcionários, registre adiantamentos e acompanhe as finanças da pizzaria.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

