"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Receipt,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  Clock,
  Calculator,
  Settings,
  Shield,
  Pizza,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, adminOnly: true },
  { name: "Cardápio", href: "/admin/cardapio", icon: Pizza, adminOnly: true },
  { name: "Funcionários", href: "/admin/funcionarios", icon: Users, adminOnly: true },
  { name: "Controle de Ponto", href: "/admin/ponto", icon: Clock, adminOnly: false },
  { name: "Fechamento", href: "/admin/fechamento", icon: Calculator, adminOnly: true },
  { name: "Adiantamentos", href: "/admin/adiantamentos", icon: Wallet, adminOnly: true },
  { name: "Despesas", href: "/admin/despesas", icon: Receipt, adminOnly: true },
  { name: "Receitas", href: "/admin/receitas", icon: TrendingUp, adminOnly: true },
  { name: "Usuários", href: "/admin/usuarios", icon: Users, adminOnly: true },
  { name: "Segurança", href: "/admin/seguranca", icon: Shield, adminOnly: true },
  { name: "Configurações", href: "/admin/configuracoes", icon: Settings, adminOnly: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const userRole = (session?.user?.role as string) || "MANAGER";
  const isAdmin = userRole === "ADMIN";
  
  // Filtrar itens de navegação baseado no papel
  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

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

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* User */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || "Usuário"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {isAdmin ? "Administrador" : "Gerente"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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

