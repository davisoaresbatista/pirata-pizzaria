import { z } from "zod";
import { schemas } from "./api-security";

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const createUserSchema = z.object({
  name: schemas.name,
  email: schemas.email,
  password: schemas.simplePassword, // Manter compatível, mas idealmente usar schemas.password
  role: z.enum(["ADMIN", "MANAGER"]).default("MANAGER"),
});

export const updateUserSchema = z.object({
  name: schemas.name.optional(),
  email: schemas.email.optional(),
  password: schemas.simplePassword.optional(),
  role: z.enum(["ADMIN", "MANAGER"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ============================================================================
// EMPLOYEE SCHEMAS
// ============================================================================

export const createEmployeeSchema = z.object({
  name: schemas.name,
  role: z.string().min(1).max(100).default("Funcionário"),
  phone: schemas.phone,
  document: schemas.document,
  hireDate: schemas.optionalDate,
  salary: schemas.money.optional(),
  
  // Turno Almoço
  worksLunch: schemas.flexibleBoolean.default(false),
  lunchPaymentType: z.enum(["HOUR", "SHIFT", "DAY", "WEEK", "MONTH"]).default("SHIFT"),
  lunchValue: schemas.money.optional(),
  lunchStartTime: schemas.time,
  lunchEndTime: schemas.time,
  
  // Turno Jantar
  worksDinner: schemas.flexibleBoolean.default(true),
  dinnerPaymentType: z.enum(["HOUR", "SHIFT", "DAY", "WEEK", "MONTH"]).default("SHIFT"),
  dinnerWeekdayValue: schemas.money.optional(),
  dinnerWeekendValue: schemas.money.optional(),
  dinnerStartTime: schemas.time,
  dinnerEndTime: schemas.time,
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

// ============================================================================
// TIME ENTRY SCHEMAS
// ============================================================================

export const createTimeEntrySchema = z.object({
  employeeId: schemas.id,
  date: schemas.date,
  workedLunch: schemas.flexibleBoolean.default(false),
  workedDinner: schemas.flexibleBoolean.default(false),
  clockInLunch: schemas.time,
  clockOutLunch: schemas.time,
  clockInDinner: schemas.time,
  clockOutDinner: schemas.time,
  status: z.enum(["PRESENT", "ABSENT", "LATE", "HALF_DAY"]).default("PRESENT"),
  notes: schemas.notes,
});

export const updateTimeEntrySchema = createTimeEntrySchema.partial().extend({
  employeeId: schemas.id.optional(),
  date: schemas.date.optional(),
});

export const timeEntryQuerySchema = z.object({
  date: schemas.date.optional(),
  employeeId: schemas.id.optional(),
  startDate: schemas.date.optional(),
  endDate: schemas.date.optional(),
});

export type CreateTimeEntryInput = z.infer<typeof createTimeEntrySchema>;
export type UpdateTimeEntryInput = z.infer<typeof updateTimeEntrySchema>;

// ============================================================================
// ADVANCE SCHEMAS
// ============================================================================

export const createAdvanceSchema = z.object({
  employeeId: schemas.id,
  amount: schemas.money,
  requestDate: schemas.optionalDate,
  notes: schemas.notes,
});

export const updateAdvanceSchema = z.object({
  amount: schemas.money.optional(),
  status: z.enum(["PENDING", "APPROVED", "PAID", "REJECTED"]).optional(),
  paymentDate: schemas.optionalDate,
  notes: schemas.notes,
});

export const advanceQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "PAID", "REJECTED"]).optional(),
  employeeId: schemas.id.optional(),
});

export type CreateAdvanceInput = z.infer<typeof createAdvanceSchema>;
export type UpdateAdvanceInput = z.infer<typeof updateAdvanceSchema>;

// ============================================================================
// EXPENSE SCHEMAS
// ============================================================================

export const createExpenseSchema = z.object({
  category: z.string().min(1, "Categoria é obrigatória").max(100),
  description: z.string().min(1, "Descrição é obrigatória").max(500),
  amount: schemas.money,
  date: schemas.date,
  notes: schemas.notes,
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

// ============================================================================
// REVENUE SCHEMAS
// ============================================================================

export const createRevenueSchema = z.object({
  source: z.string().min(1, "Fonte é obrigatória").max(100),
  description: z.string().max(500).optional().transform(v => v || null),
  amount: schemas.money,
  date: schemas.date,
  notes: schemas.notes,
});

export const updateRevenueSchema = createRevenueSchema.partial();

export type CreateRevenueInput = z.infer<typeof createRevenueSchema>;
export type UpdateRevenueInput = z.infer<typeof updateRevenueSchema>;

// ============================================================================
// PAYROLL SCHEMAS
// ============================================================================

export const createPayrollEntrySchema = z.object({
  employeeId: schemas.id,
  month: z.string().regex(/^\d{4}-\d{2}$/, "Formato de mês inválido (YYYY-MM)"),
  baseSalary: schemas.money,
  advances: schemas.money.optional(),
  bonuses: schemas.money.optional(),
  deductions: schemas.money.optional(),
  netSalary: schemas.money,
  paymentDate: schemas.optionalDate,
  paid: schemas.flexibleBoolean.optional(),
  notes: schemas.notes,
});

export const updatePayrollEntrySchema = createPayrollEntrySchema.partial();

export type CreatePayrollEntryInput = z.infer<typeof createPayrollEntrySchema>;
export type UpdatePayrollEntryInput = z.infer<typeof updatePayrollEntrySchema>;

// ============================================================================
// SHIFT CONFIG SCHEMAS
// ============================================================================

export const updateShiftConfigSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  value: schemas.money,
});

export type UpdateShiftConfigInput = z.infer<typeof updateShiftConfigSchema>;

// ============================================================================
// PAYROLL PERIOD SCHEMAS
// ============================================================================

export const createPayrollPeriodSchema = z.object({
  startDate: schemas.date,
  endDate: schemas.date,
  periodType: z.enum(["WEEKLY", "BIWEEKLY", "MONTHLY"]),
});

export const closePayrollPeriodSchema = z.object({
  periodId: schemas.id,
});

export type CreatePayrollPeriodInput = z.infer<typeof createPayrollPeriodSchema>;

