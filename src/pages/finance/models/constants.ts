
// Finance module constants

export const PAYMENT_STATUS = {
  PAID: "paid",
  PENDING: "pending",
  OVERDUE: "overdue",
  CANCELLED: "cancelled"
} as const;

export const PAYMENT_METHODS = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "PIX",
  "Transferência Bancária",
  "Boleto Bancário",
  "Cheque"
];

export const PAYMENT_CATEGORIES = [
  "Mensalidade",
  "Matrícula",
  "Material",
  "Uniforme",
  "Evento",
  "Aulas Extras",
  "Outros"
];

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Água",
  "Luz",
  "Telefone",
  "Internet",
  "Material de Limpeza",
  "Material de Escritório",
  "Salários",
  "Impostos",
  "Marketing",
  "Outros"
];

export const MODALITY_TYPES = [
  "Ballet",
  "Jazz",
  "Hip Hop",
  "Contemporâneo",
  "Dança de Salão",
  "Futsal",
  "Ginástica",
  "Ritmica",
  "Outros"
];

export const CLASS_DAYS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo"
];
