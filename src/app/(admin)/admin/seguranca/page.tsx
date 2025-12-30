"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  User,
  Globe,
  FileText,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  userAgent: string | null;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function SecurityPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Estados
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [auditPagination, setAuditPagination] = useState<PaginationInfo | null>(null);
  const [loginPagination, setLoginPagination] = useState<PaginationInfo | null>(null);
  const [loginStats, setLoginStats] = useState({ successful: 0, failed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchAction, setSearchAction] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Verificar permissão
  useEffect(() => {
    if (session?.user?.role !== "ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  // Buscar logs de auditoria
  const fetchAuditLogs = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchAction) params.set("action", searchAction);
      
      const res = await fetch(`/api/security/logs?${params}`);
      const data = await res.json();
      
      if (res.ok) {
        setAuditLogs(data.logs);
        setAuditPagination(data.pagination);
      }
    } catch (error) {
      console.error("Erro ao buscar logs:", error);
    }
  }, [searchAction]);

  // Buscar tentativas de login
  const fetchLoginAttempts = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (searchEmail) params.set("email", searchEmail);
      
      const res = await fetch(`/api/security/login-attempts?${params}`);
      const data = await res.json();
      
      if (res.ok) {
        setLoginAttempts(data.attempts);
        setLoginPagination(data.pagination);
        setLoginStats(data.stats.last24h);
      }
    } catch (error) {
      console.error("Erro ao buscar tentativas:", error);
    }
  }, [searchEmail]);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAuditLogs(), fetchLoginAttempts()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchAuditLogs, fetchLoginAttempts]);

  // Formatar data
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Badge de ação
  const getActionBadge = (action: string) => {
    if (action.includes("DELETE")) {
      return <Badge variant="destructive">{action}</Badge>;
    }
    if (action.includes("CREATE")) {
      return <Badge className="bg-green-500">{action}</Badge>;
    }
    if (action.includes("UPDATE")) {
      return <Badge className="bg-blue-500">{action}</Badge>;
    }
    if (action.includes("DENIED")) {
      return <Badge variant="destructive">{action}</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Segurança
          </h1>
          <p className="text-muted-foreground">
            Monitore atividades e tentativas de acesso
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            fetchAuditLogs();
            fetchLoginAttempts();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logins (24h)
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loginStats.successful}
            </div>
            <p className="text-xs text-muted-foreground">
              bem-sucedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Falhas (24h)
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loginStats.failed}
            </div>
            <p className="text-xs text-muted-foreground">
              tentativas falhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Logs
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditPagination?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              ações registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Sucesso
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loginStats.successful + loginStats.failed > 0
                ? Math.round(
                    (loginStats.successful / (loginStats.successful + loginStats.failed)) * 100
                  )
                : 100}%
            </div>
            <p className="text-xs text-muted-foreground">
              logins bem-sucedidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs de Auditoria
          </TabsTrigger>
          <TabsTrigger value="login" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Tentativas de Login
          </TabsTrigger>
        </TabsList>

        {/* Tab: Logs de Auditoria */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria</CardTitle>
              <CardDescription>
                Histórico de todas as ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="searchAction">Filtrar por ação</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="searchAction"
                      placeholder="Ex: CREATE_USER, DELETE..."
                      value={searchAction}
                      onChange={(e) => setSearchAction(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => fetchAuditLogs()}>Buscar</Button>
                </div>
              </div>

              {/* Tabela */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Recurso</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum log encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDate(log.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>{log.userEmail}</TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.resource}
                            {log.resourceId && (
                              <span className="text-muted-foreground">
                                /{log.resourceId.slice(0, 8)}...
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              {log.ipAddress}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {auditPagination && auditPagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Página {auditPagination.page} de {auditPagination.totalPages} ({auditPagination.total} registros)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPagination.page - 1)}
                      disabled={auditPagination.page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAuditLogs(auditPagination.page + 1)}
                      disabled={auditPagination.page === auditPagination.totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Tentativas de Login */}
        <TabsContent value="login" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tentativas de Login</CardTitle>
              <CardDescription>
                Histórico de tentativas de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="searchEmail">Filtrar por email</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="searchEmail"
                      placeholder="Email..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => fetchLoginAttempts()}>Buscar</Button>
                </div>
              </div>

              {/* Tabela */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Navegador</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginAttempts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhuma tentativa encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      loginAttempts.map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {formatDate(attempt.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>{attempt.email}</TableCell>
                          <TableCell>
                            {attempt.success ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Sucesso
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                Falha
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              {attempt.ipAddress}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                            {attempt.userAgent || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {loginPagination && loginPagination.totalPages > 1 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Página {loginPagination.page} de {loginPagination.totalPages} ({loginPagination.total} registros)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLoginAttempts(loginPagination.page - 1)}
                      disabled={loginPagination.page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchLoginAttempts(loginPagination.page + 1)}
                      disabled={loginPagination.page === loginPagination.totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

