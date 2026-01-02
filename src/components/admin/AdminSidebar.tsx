"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Receipt,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Clock,
  Calculator,
  Settings,
  Shield,
  Pizza,
  Brain,
  UserCog,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Tipos
interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  adminOnly: boolean;
}

interface NavGroup {
  name: string;
  items: NavItem[];
  adminOnly?: boolean;
  collapsible?: boolean;
}

// Navegação agrupada
const navigationGroups: NavGroup[] = [
  {
    name: "Geral",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, adminOnly: true },
    ],
  },
  {
    name: "Operações",
    items: [
      { name: "Cardápio", href: "/admin/cardapio", icon: Pizza, adminOnly: true },
      { name: "Controle de Ponto", href: "/admin/ponto", icon: Clock, adminOnly: false },
      { name: "Fechamento", href: "/admin/fechamento", icon: Calculator, adminOnly: true },
    ],
  },
  {
    name: "Equipe",
    adminOnly: true,
    items: [
      { name: "Funcionários", href: "/admin/funcionarios", icon: Users, adminOnly: true },
      { name: "Adiantamentos", href: "/admin/adiantamentos", icon: Wallet, adminOnly: true },
    ],
  },
  {
    name: "Financeiro",
    adminOnly: true,
    items: [
      { name: "Despesas", href: "/admin/despesas", icon: Receipt, adminOnly: true },
      { name: "Receitas", href: "/admin/receitas", icon: TrendingUp, adminOnly: true },
    ],
  },
  {
    name: "Análise",
    adminOnly: true,
    items: [
      { name: "Inteligência", href: "/admin/inteligencia", icon: Brain, adminOnly: true },
    ],
  },
  {
    name: "Sistema",
    adminOnly: true,
    collapsible: true,
    items: [
      { name: "Usuários", href: "/admin/usuarios", icon: UserCog, adminOnly: true },
      { name: "Segurança", href: "/admin/seguranca", icon: Shield, adminOnly: true },
      { name: "Configurações", href: "/admin/configuracoes", icon: Settings, adminOnly: true },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>(["Sistema"]);
  
  // Aguardar sessão carregar antes de determinar o papel
  // Durante o loading, assumimos ADMIN para não piscar o menu
  const isLoading = status === "loading";
  const userRole = session?.user?.role as string | undefined;
  const isAdmin = isLoading || userRole === "ADMIN";

  const toggleGroup = (groupName: string) => {
    setCollapsedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  // Filtrar grupos e itens baseado no papel
  const filteredGroups = navigationGroups
    .filter(group => !group.adminOnly || isAdmin)
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.adminOnly || isAdmin)
    }))
    .filter(group => group.items.length > 0);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <Image
          src="/logo/image.png"
          alt="Pirata Pizzaria"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">Pirata Pizzaria</p>
          <p className="text-xs text-sidebar-foreground/60">Painel Admin</p>
        </div>
      </div>

      {/* Navigation com grupos */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {filteredGroups.map((group) => {
          const isCollapsed = group.collapsible && collapsedGroups.includes(group.name);
          const hasActiveItem = group.items.some(item => pathname === item.href);
          
          return (
            <div key={group.name}>
              {/* Label do grupo */}
              {group.collapsible ? (
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-colors",
                    hasActiveItem 
                      ? "text-sidebar-foreground" 
                      : "text-sidebar-foreground/50 hover:text-sidebar-foreground/70"
                  )}
                >
                  {group.name}
                  <ChevronDown 
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      isCollapsed ? "-rotate-90" : ""
                    )} 
                  />
                </button>
              ) : (
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.name}
                </p>
              )}
              
              {/* Itens do grupo */}
              <div className={cn(
                "mt-1 space-y-0.5 transition-all",
                isCollapsed && "hidden"
              )}>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-red-600 text-white shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4.5 w-4.5", isActive && "text-white")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-red-600 text-white text-sm font-medium">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || "Usuário"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {isLoading ? "Carregando..." : userRole === "ADMIN" ? "Administrador" : "Gerente"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-md hover:bg-neutral-100"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
