/**
 * Retorna a data atual no formato YYYY-MM-DD usando o fuso horário local
 * Evita o problema de toISOString() que usa UTC
 */
export function getLocalDateString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Retorna o mês atual no formato YYYY-MM usando o fuso horário local
 */
export function getLocalMonthString(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Converte uma string de data YYYY-MM-DD para Date no fuso horário local
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

