
import { v4 as uuidv4 } from 'uuid';
import type { Student, Payment, Bill, Transaction, Enrollment } from './types';

// Mock Students Data
export const STUDENTS: Student[] = [
  {
    id: uuidv4(),
    name: "João Silva",
    email: "joao.silva@example.com",
    phone: "1199999999",
    age: 10,
    birthday: "2013-05-20",
    modality: "Futsal",
    class: "Futsal Infantil - Terça e Quinta",
    status: "active",
    address: "Rua das Flores, 123",
    cityState: "São Paulo, SP",
    zipCode: "01000-000",
    parentName: "Pedro Silva",
    parentPhone: "1198888888",
    parentCPF: "123.456.789-00",
    enrollmentDate: "2023-01-15",
    notes: "Aluno dedicado e com bom desempenho."
  },
  {
    id: uuidv4(),
    name: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    phone: "2199999999",
    age: 12,
    birthday: "2011-10-10",
    modality: "Ballet",
    class: "Ballet Juvenil - Segunda e Sexta",
    status: "active",
    address: "Avenida Paulista, 456",
    cityState: "Rio de Janeiro, RJ",
    zipCode: "20000-000",
    parentName: "Ana Oliveira",
    parentPhone: "2197777777",
    parentCPF: "987.654.321-00",
    enrollmentDate: "2023-02-20",
    notes: "Precisa de mais atenção nas aulas práticas."
  },
  {
    id: uuidv4(),
    name: "Lucas Santos",
    email: "lucas.santos@example.com",
    phone: "3199999999",
    age: 9,
    birthday: "2014-03-25",
    modality: "Ginástica",
    class: "Ginástica Artística - Terça e Quinta",
    status: "inactive",
    address: "Rua da Bahia, 789",
    cityState: "Belo Horizonte, MG",
    zipCode: "30000-000",
    parentName: "Marcos Santos",
    parentPhone: "3196666666",
    parentCPF: "456.789.123-00",
    enrollmentDate: "2023-03-10",
    notes: "Afastado por motivo de saúde."
  },
  {
    id: uuidv4(),
    name: "Sofia Almeida",
    email: "sofia.almeida@example.com",
    phone: "4199999999",
    age: 11,
    birthday: "2012-07-01",
    modality: "Jazz",
    class: "Jazz Teen - Terça e Quinta",
    status: "active",
    address: "Rua XV de Novembro, 1011",
    cityState: "Curitiba, PR",
    zipCode: "80000-000",
    parentName: "Carla Almeida",
    parentPhone: "4195555555",
    parentCPF: "789.123.456-00",
    enrollmentDate: "2023-04-05",
    notes: "Destaque nas apresentações de Jazz."
  },
  {
    id: uuidv4(),
    name: "Enzo Costa",
    email: "enzo.costa@example.com",
    phone: "5199999999",
    age: 8,
    birthday: "2015-12-15",
    modality: "Hip Hop",
    class: "Hip Hop Teen - Sexta e Sábado",
    status: "active",
    address: "Avenida Farrapos, 1213",
    cityState: "Porto Alegre, RS",
    zipCode: "90000-000",
    parentName: "Ricardo Costa",
    parentPhone: "5194444444",
    parentCPF: "234.567.890-00",
    enrollmentDate: "2023-05-01",
    notes: "Participa ativamente das aulas de Hip Hop."
  }
];

// Mock Payments Data
export const PAYMENTS: Payment[] = [
  {
    id: uuidv4(),
    studentId: STUDENTS[0].id,
    studentName: STUDENTS[0].name,
    value: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Cartão de Crédito",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
    notes: "Pagamento efetuado no prazo."
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[1].id,
    studentName: STUDENTS[1].name,
    value: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Boleto Bancário",
    category: "Mensalidade",
    status: "pending",
    dueDate: "2023-10-05",
    notes: "Aguardando compensação do boleto."
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[2].id,
    studentName: STUDENTS[2].name,
    value: 150.00,
    date: "2023-09-01",
    description: "Mensalidade de Setembro",
    method: "Dinheiro",
    category: "Mensalidade",
    status: "overdue",
    dueDate: "2023-09-05",
    notes: "Pagamento em atraso. Aluno afastado."
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[3].id,
    studentName: STUDENTS[3].name,
    value: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "Transferência Bancária",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
    notes: "Transferência realizada com sucesso."
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[4].id,
    studentName: STUDENTS[4].name,
    value: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "PIX",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
    notes: "Pagamento via PIX confirmado."
  }
];

// Mock Suppliers Data
export const SUPPLIERS = [
  {
    id: uuidv4(),
    name: "Sanepar"
  },
  {
    id: uuidv4(),
    name: "Copel"
  },
  {
    id: uuidv4(),
    name: "Vivo"
  },
  {
    id: uuidv4(),
    name: "Claro"
  },
  {
    id: uuidv4(),
    name: "Mercado Livre"
  }
];

// Mock Bills Data
export const BILLS: Bill[] = [
  {
    id: uuidv4(),
    description: "Conta de água",
    supplier: "Sanepar",
    category: "Água",
    value: 150.00,
    dueDate: "2023-10-15",
    installments: 1,
    status: "pending",
    notes: "Referente ao mês de setembro."
  },
  {
    id: uuidv4(),
    description: "Conta de luz",
    supplier: "Copel",
    category: "Luz",
    value: 300.00,
    dueDate: "2023-10-20",
    status: "pending",
    installments: 1,
    notes: "Referente ao mês de setembro."
  },
  {
    id: uuidv4(),
    description: "Conta de telefone",
    supplier: "Vivo",
    category: "Telefone",
    value: 100.00,
    dueDate: "2023-10-25",
    status: "pending",
    installments: 1,
    notes: "Referente ao plano de telefonia."
  },
  {
    id: uuidv4(),
    description: "Compra de materiais de limpeza",
    supplier: "Mercado Livre",
    category: "Material de Limpeza",
    value: 200.00,
    dueDate: "2023-10-30",
    status: "pending",
    installments: 2,
    notes: "Compra realizada para o estoque."
  }
];

// Mock Transactions Data
export const TRANSACTIONS: Transaction[] = [
  {
    id: uuidv4(),
    description: "Mensalidade de João",
    amount: 150,
    date: "2023-10-05",
    category: "Mensalidade",
    type: "income",
    paymentMethod: "Cartão de Crédito",
    notes: "Pagamento da mensalidade de outubro"
  },
  {
    id: uuidv4(),
    description: "Pagamento de instrutor",
    amount: 1500,
    date: "2023-10-10",
    category: "Salários",
    type: "expense",
    paymentMethod: "Transferência",
    notes: "Pagamento do instrutor de ballet"
  },
  {
    id: uuidv4(),
    description: "Compra de materiais",
    amount: 350,
    date: "2023-10-12",
    category: "Material de Escritório",
    type: "expense",
    paymentMethod: "Cartão de Débito",
    notes: "Materiais para secretaria"
  },
  {
    id: uuidv4(),
    description: "Mensalidade de Maria",
    amount: 150,
    date: "2023-10-07",
    category: "Mensalidade",
    type: "income",
    paymentMethod: "PIX",
    notes: "Pagamento da mensalidade de outubro"
  }
];

// Mock Enrollments Data
export const ENROLLMENTS: Enrollment[] = [
  {
    id: uuidv4(),
    studentId: STUDENTS[0].id,
    studentName: STUDENTS[0].name,
    modality: "Futsal",
    class: "Futsal Infantil - Terça e Quinta",
    enrollmentDate: "2023-01-15",
    status: "active",
    enrollmentFee: 100,
    monthlyFee: 150,
    paymentDay: 5,
    notes: "Primeira matrícula do aluno"
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[1].id,
    studentName: STUDENTS[1].name,
    modality: "Ballet",
    class: "Ballet Juvenil - Segunda e Sexta",
    enrollmentDate: "2023-02-20",
    status: "active",
    enrollmentFee: 100,
    monthlyFee: 150,
    paymentDay: 5,
    notes: "Aluna veio transferida de outra escola"
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[2].id,
    studentName: STUDENTS[2].name,
    modality: "Ginástica",
    class: "Ginástica Artística - Terça e Quinta",
    enrollmentDate: "2023-03-10",
    status: "inactive",
    enrollmentFee: 100,
    monthlyFee: 150,
    paymentDay: 5,
    notes: "Aluno em recuperação médica"
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[3].id,
    studentName: STUDENTS[3].name,
    modality: "Jazz",
    class: "Jazz Teen - Terça e Quinta",
    enrollmentDate: "2023-04-05",
    status: "active",
    enrollmentFee: 100,
    monthlyFee: 150,
    paymentDay: 5,
    notes: "Aluna com bolsa parcial"
  }
];
