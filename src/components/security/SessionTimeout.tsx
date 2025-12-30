"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, LogOut } from "lucide-react";

// ============================================================================
// CONFIGURAÇÃO DE TIMEOUT
// ============================================================================

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos de inatividade
const WARNING_BEFORE_LOGOUT_MS = 5 * 60 * 1000; // Aviso 5 minutos antes
const CHECK_INTERVAL_MS = 60 * 1000; // Verificar a cada 1 minuto

// ============================================================================
// COMPONENTE
// ============================================================================

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const lastActivityRef = useRef(Date.now());
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resetar timer de atividade
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    
    // Limpar timeouts existentes
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }

    // Configurar novo aviso
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(WARNING_BEFORE_LOGOUT_MS / 1000);
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_LOGOUT_MS);

    // Configurar logout
    logoutTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, []);

  // Logout por inatividade
  const handleLogout = useCallback(async () => {
    console.info("[SECURITY] Logout por inatividade");
    await signOut({ callbackUrl: "/login?reason=timeout" });
  }, []);

  // Continuar sessão
  const handleContinue = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  // Contador regressivo do aviso
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  // Monitorar atividade do usuário
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"];

    const handleActivity = () => {
      // Só resetar se não estiver mostrando o aviso
      if (!showWarning) {
        resetActivity();
      }
    };

    // Adicionar listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Iniciar timer
    resetActivity();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, [resetActivity, showWarning]);

  // Formatar tempo restante
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={showWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Sessão Expirando
          </DialogTitle>
          <DialogDescription>
            Sua sessão será encerrada por inatividade em{" "}
            <span className="font-bold text-amber-600">
              {formatTime(timeRemaining)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Clique em &quot;Continuar&quot; para manter sua sessão ativa ou em &quot;Sair&quot; para fazer logout agora.
          </p>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button onClick={handleContinue}>
              Continuar Trabalhando
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

