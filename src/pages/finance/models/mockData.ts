
import { v4 as uuidv4 } from 'uuid';
import { Student, Payment, Bill, Supplier, Transaction, Enrollment, Modality, Class } from './types';

// Mock Students
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

// Mock Payments
export const PAYMENTS: Payment[] = [
  {
    id: uuidv4(),
    studentId: STUDENTS[0].id,
    studentName: STUDENTS[0].name,
    amount: 150.00,
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
    amount: 150.00,
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
    amount: 150.00,
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
    amount: 150.00,
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
    amount: 150.00,
    date: "2023-10-05",
    description: "Mensalidade de Outubro",
    method: "PIX",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-10-05",
    notes: "Pagamento via PIX confirmado."
  }
];

// Mock Suppliers
export const SUPPLIERS: Supplier[] = [
  { id: uuidv4(), name: "Sanepar" },
  { id: uuidv4(), name: "Copel" },
  { id: uuidv4(), name: "Vivo" },
  { id: uuidv4(), name: "Claro" },
  { id: uuidv4(), name: "Mercado Livre" },
];

// Mock Bills
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
    installments: 1,
    status: "pending",
    notes: "Referente ao mês de setembro."
  },
  {
    id: uuidv4(),
    description: "Conta de telefone",
    supplier: "Vivo",
    category: "Telefone",
    value: 100.00,
    dueDate: "2023-10-25",
    installments: 1,
    status: "pending",
    notes: "Referente ao plano de telefonia."
  },
  {
    id: uuidv4(),
    description: "Compra de materiais de limpeza",
    supplier: "Mercado Livre",
    category: "Material de Limpeza",
    value: 200.00,
    dueDate: "2023-10-30",
    installments: 2,
    status: "pending",
    notes: "Compra realizada para o estoque."
  }
];

// Mock Transactions
export const TRANSACTIONS: Transaction[] = [
  {
    id: uuidv4(),
    date: "2023-10-05",
    amount: 500.00,
    description: "Venda de uniformes",
    category: "Vendas",
    method: "Dinheiro",
    type: "income",
    notes: "Venda de 5 uniformes"
  },
  {
    id: uuidv4(),
    date: "2023-10-03",
    amount: 300.00,
    description: "Compra de material de limpeza",
    category: "Material de Limpeza",
    method: "Cartão de Crédito",
    type: "expense",
    notes: "Material para o mês de outubro"
  }
];

// Mock Enrollments
export const ENROLLMENTS: Enrollment[] = [
  {
    id: uuidv4(),
    studentId: STUDENTS[0].id,
    studentName: STUDENTS[0].name,
    modality: "Futsal",
    modalityName: "Futsal",
    className: "Futsal Infantil - Terça e Quinta",
    startDate: "2023-01-15",
    date: "2023-01-15",
    status: "active",
    value: 150.00,
    notes: "Matrícula regular"
  },
  {
    id: uuidv4(),
    studentId: STUDENTS[1].id,
    studentName: STUDENTS[1].name,
    modality: "Ballet",
    modalityName: "Ballet",
    className: "Ballet Juvenil - Segunda e Sexta",
    startDate: "2023-02-20",
    date: "2023-02-20",
    status: "active",
    value: 150.00,
    notes: "Matrícula regular"
  }
];

// Mock Modalities
export const MODALITIES: Modality[] = [
  {
    id: uuidv4(),
    name: "Ballet",
    monthlyFee: 150.00,
    description: "Aulas de ballet clássico"
  },
  {
    id: uuidv4(),
    name: "Futsal",
    monthlyFee: 120.00,
    description: "Aulas de futsal"
  },
  {
    id: uuidv4(),
    name: "Jazz",
    monthlyFee: 130.00,
    description: "Aulas de jazz dance"
  },
  {
    id: uuidv4(),
    name: "Hip Hop",
    monthlyFee: 120.00,
    description: "Aulas de hip hop"
  },
  {
    id: uuidv4(),
    name: "Ginástica",
    monthlyFee: 140.00,
    description: "Aulas de ginástica artística"
  }
];

// Mock Classes
export const CLASSES: Class[] = [
  {
    id: uuidv4(),
    name: "Ballet Infantil - Segunda e Quarta",
    modalityId: MODALITIES[0].id,
    schedule: "Segunda e Quarta, 15:00 - 16:00",
    instructor: "Ana Beatriz",
    maxStudents: 15
  },
  {
    id: uuidv4(),
    name: "Ballet Juvenil - Segunda e Sexta",
    modalityId: MODALITIES[0].id,
    schedule: "Segunda e Sexta, 17:00 - 18:30",
    instructor: "Ana Beatriz",
    maxStudents: 12
  },
  {
    id: uuidv4(),
    name: "Futsal Infantil - Terça e Quinta",
    modalityId: MODALITIES[1].id,
    schedule: "Terça e Quinta, 16:00 - 17:00",
    instructor: "Carlos Eduardo",
    maxStudents: 20
  },
  {
    id: uuidv4(),
    name: "Jazz Teen - Terça e Quinta",
    modalityId: MODALITIES[2].id,
    schedule: "Terça e Quinta, 18:30 - 20:00",
    instructor: "Patrícia Souza",
    maxStudents: 15
  },
  {
    id: uuidv4(),
    name: "Hip Hop Teen - Sexta e Sábado",
    modalityId: MODALITIES[3].id,
    schedule: "Sexta, 19:00 - 20:30 e Sábado, 10:00 - 11:30",
    instructor: "Ricardo Mendes",
    maxStudents: 20
  },
  {
    id: uuidv4(),
    name: "Ginástica Artística - Terça e Quinta",
    modalityId: MODALITIES[4].id,
    schedule: "Terça e Quinta, 14:00 - 15:30",
    instructor: "Fernanda Lima",
    maxStudents: 10
  }
];
