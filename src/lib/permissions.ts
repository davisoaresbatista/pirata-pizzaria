// Lógica de permissões para o sistema

export type UserRole = "ADMIN" | "MANAGER";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Verifica se o usuário pode editar um registro de ponto
export function canEditTimeEntry(
  userRole: UserRole,
  entryDate: Date | string
): { allowed: boolean; reason?: string } {
  // Admin pode editar qualquer registro
  if (userRole === "ADMIN") {
    return { allowed: true };
  }

  // Gerente só pode editar até 2 dias após a data do registro
  const entry = new Date(entryDate);
  const today = new Date();
  
  // Zerar horas para comparar apenas datas
  entry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - entry.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 2) {
    return {
      allowed: false,
      reason: `Registro de ${entry.toLocaleDateString("pt-BR")} não pode ser alterado. Gerentes só podem alterar registros até 2 dias após a data. Solicite ao administrador.`,
    };
  }

  return { allowed: true };
}

// Verifica se o usuário pode acessar a página de ponto
export function canAccessTimeEntries(userRole: UserRole): boolean {
  return userRole === "ADMIN" || userRole === "MANAGER";
}

// Verifica se o usuário pode deletar um registro
export function canDeleteTimeEntry(userRole: UserRole): boolean {
  // Somente admin pode deletar
  return userRole === "ADMIN";
}

// Verifica se pode criar registros retroativos
export function canCreateRetroactiveEntry(
  userRole: UserRole,
  entryDate: Date | string
): { allowed: boolean; reason?: string } {
  // Admin pode criar qualquer registro
  if (userRole === "ADMIN") {
    return { allowed: true };
  }

  // Gerente só pode criar até 2 dias atrás
  const entry = new Date(entryDate);
  const today = new Date();
  
  entry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - entry.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 2) {
    return {
      allowed: false,
      reason: `Não é possível criar registro para ${entry.toLocaleDateString("pt-BR")}. Gerentes só podem registrar ponto até 2 dias no passado.`,
    };
  }

  return { allowed: true };
}

