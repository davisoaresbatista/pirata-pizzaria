"use client";

/**
 * Campo honeypot invisível para capturar bots
 * 
 * Bots geralmente preenchem todos os campos de formulário automaticamente.
 * Este campo é invisível para usuários reais, mas visível para bots.
 * Se o campo for preenchido, sabemos que é um bot.
 * 
 * Uso:
 * 1. Adicione <HoneypotField name="website" /> no formulário
 * 2. No submit, verifique se formData.website está vazio
 * 3. Se estiver preenchido, rejeite o submit silenciosamente
 */

interface HoneypotFieldProps {
  name?: string;
}

export function HoneypotField({ name = "website" }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      <label htmlFor={name}>
        Deixe em branco
        <input
          type="text"
          id={name}
          name={name}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>
    </div>
  );
}

/**
 * Hook para verificar honeypot
 */
export function isHoneypotFilled(formData: FormData | Record<string, unknown>, fieldName = "website"): boolean {
  if (formData instanceof FormData) {
    const value = formData.get(fieldName);
    return value !== null && value !== "";
  }
  
  const value = formData[fieldName];
  return value !== undefined && value !== null && value !== "";
}

