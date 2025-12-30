"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

// ============================================================================
// REQUIREMENTS
// ============================================================================

const requirements: PasswordRequirement[] = [
  { label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Número", test: (p) => /\d/.test(p) },
  { label: "Caractere especial", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function PasswordStrength({ password, showRequirements = true }: PasswordStrengthProps) {
  const analysis = useMemo(() => {
    const passed = requirements.filter((r) => r.test(password));
    const score = passed.length;
    
    let strength: "weak" | "fair" | "good" | "strong";
    let color: string;
    let label: string;
    
    if (score <= 1) {
      strength = "weak";
      color = "bg-red-500";
      label = "Fraca";
    } else if (score <= 2) {
      strength = "fair";
      color = "bg-orange-500";
      label = "Regular";
    } else if (score <= 3) {
      strength = "good";
      color = "bg-yellow-500";
      label = "Boa";
    } else {
      strength = "strong";
      color = "bg-green-500";
      label = "Forte";
    }
    
    return {
      passed,
      score,
      percentage: (score / requirements.length) * 100,
      strength,
      color,
      label,
    };
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Barra de força */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Força da senha</span>
          <span className={`font-medium ${
            analysis.strength === "weak" ? "text-red-500" :
            analysis.strength === "fair" ? "text-orange-500" :
            analysis.strength === "good" ? "text-yellow-600" :
            "text-green-500"
          }`}>
            {analysis.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${analysis.color}`}
            style={{ width: `${analysis.percentage}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      {showRequirements && (
        <ul className="space-y-1 text-xs">
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <li
                key={index}
                className={`flex items-center gap-2 ${
                  passed ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {passed ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <X className="h-3 w-3" />
                )}
                {req.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ============================================================================
// HOOK FOR VALIDATION
// ============================================================================

export function usePasswordStrength(password: string) {
  return useMemo(() => {
    const passed = requirements.filter((r) => r.test(password));
    const score = passed.length;
    
    return {
      isValid: score >= 4, // Pelo menos 4 de 5 requisitos
      isStrong: score === requirements.length,
      score,
      maxScore: requirements.length,
      requirements: requirements.map((r) => ({
        label: r.label,
        passed: r.test(password),
      })),
    };
  }, [password]);
}

