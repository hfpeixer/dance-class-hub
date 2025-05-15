// Import models
import { Student, Payment, Bill, Transaction, Enrollment, Modality, Class } from './types';

// Mock data for students
export const STUDENTS: Student[] = [
  {
    id: "s1",
    name: "Ana Silva",
    email: "ana.silva@example.com",
    phone: "(11) 98765-4321",
    age: 9,
    birthday: "2014-05-15",
    modality: "Ballet",
    class: "Ballet Infantil - Segunda e Quarta",
    status: "active",
    address: "Rua das Flores, 123",
    cityState: "São Paulo, SP",
    zipCode: "01234-567",
    parentName: "Maria Silva",
    parentPhone: "(11) 99876-5432",
    parentCPF: "123.456.789-00",
    enrollmentDate: "2023-01-15",
    notes: "Alérgica a látex"
  },
  {
    id: "s2",
    name: "Pedro Santos",
    email: "pedro.santos@example.com",
    phone: "(11) 91234-5678",
    age: 11,
    birthday: "2012-08-20",
    modality: "Futsal",
    class: "Futsal Juvenil - Segunda e Quarta",
    status: "active",
    address: "Avenida Principal, 456",
    cityState: "São Paulo, SP",
    zipCode: "02345-678",
    parentName: "João Santos",
    parentPhone: "(11) 98888-7777",
    parentCPF: "987.654.321-00",
    enrollmentDate: "2023-02-28",
    notes: "Excelente aluno"
  },
  {
    id: "s3",
    name: "Carla Oliveira",
    email: "carla.oliveira@example.com",
    phone: "(21) 92222-3333",
    age: 10,
    birthday: "2013-11-10",
    modality: "Jazz",
    class: "Jazz Kids - Quarta e Sexta",
    status: "inactive",
    address: "Rua da Praia, 789",
    cityState: "Rio de Janeiro, RJ",
    zipCode: "20000-000",
    parentName: "Fernanda Oliveira",
    parentPhone: "(21) 97777-6666",
    parentCPF: "456.789.123-00",
    enrollmentDate: "2023-03-15",
    notes: "Mudou de cidade"
  },
  {
    id: "s4",
    name: "Lucas Pereira",
    email: "lucas.pereira@example.com",
    phone: "(31) 93333-4444",
    age: 12,
    birthday: "2011-04-25",
    modality: "Hip Hop",
    class: "Hip Hop Teen - Sexta e Sábado",
    status: "active",
    address: "Rua das Montanhas, 101",
    cityState: "Belo Horizonte, MG",
    zipCode: "30000-000",
    parentName: "Roberto Pereira",
    parentPhone: "(31) 96666-5555",
    parentCPF: "789.123.456-00",
    enrollmentDate: "2023-04-01",
    notes: "Participa de competições"
  },
  {
    id: "s5",
    name: "Mariana Souza",
    email: "mariana.souza@example.com",
    phone: "(41) 94444-5555",
    age: 8,
    birthday: "2015-07-01",
    modality: "Ginástica",
    class: "Ginástica Artística - Terça e Quinta",
    status: "active",
    address: "Avenida do Lago, 222",
    cityState: "Curitiba, PR",
    zipCode: "80000-000",
    parentName: "Patrícia Souza",
    parentPhone: "(41) 95555-4444",
    parentCPF: "321.654.987-00",
    enrollmentDate: "2023-05-10",
    notes: "Destaque na turma"
  }
];

// Mock data for suppliers
export const SUPPLIERS = [
  "Fornecedor de Materiais Didáticos",
  "Empresa de Limpeza",
  "Companhia de Água",
  "Companhia de Energia",
  "Operadora de Internet",
  "Manutenção Predial"
];

// Mock data for payments
export const PAYMENTS: Payment[] = [
  {
    id: "p1",
    studentId: "s1",
    studentName: "Ana Silva",
    value: 150,
    description: "Mensalidade - Janeiro 2023",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-01-10",
    date: "2023-01-08",
    method: "PIX",
    installments: 1,
    currentInstallment: 1,
    paymentDate: "2023-01-08"
  },
  {
    id: "p2",
    studentId: "s2",
    studentName: "Pedro Santos",
    value: 110,
    description: "Mensalidade - Fevereiro 2023",
    category: "Mensalidade",
    status: "pending",
    dueDate: "2023-02-10",
    installments: 1,
    currentInstallment: 1
  },
  {
    id: "p3",
    studentId: "s3",
    studentName: "Carla Oliveira",
    value: 140,
    description: "Mensalidade - Março 2023",
    category: "Mensalidade",
    status: "overdue",
    dueDate: "2023-03-10",
    installments: 1,
    currentInstallment: 1
  },
  {
    id: "p4",
    studentId: "s4",
    studentName: "Lucas Pereira",
    value: 130,
    description: "Mensalidade - Abril 2023",
    category: "Mensalidade",
    status: "paid",
    dueDate: "2023-04-10",
    date: "2023-04-05",
    method: "Cartão de Crédito",
    installments: 1,
    currentInstallment: 1,
    paymentDate: "2023-04-05"
  },
  {
    id: "p5",
    studentId: "s5",
    studentName: "Mariana Souza",
    value: 120,
    description: "Mensalidade - Maio 2023",
    category: "Mensalidade",
    status: "pending",
    dueDate: "2023-05-10",
    installments: 1,
    currentInstallment: 1
  }
];

// Mock data for bills
export const BILLS: Bill[] = [
  {
    id: "b1",
    description: "Aluguel - Janeiro 2023",
    supplier: "Imobiliária Central",
    category: "Aluguel",
    value: 3500,
    dueDate: "2023-01-05",
    status: "paid",
    paymentDate: "2023-01-03",
    installments: 1,
    currentInstallment: 1,
    documentNumber: "2023001",
    notes: "Pago com 2 dias de antecedência"
  },
  {
    id: "b2",
    description: "Conta de Água - Fevereiro 2023",
    supplier: "Companhia de Água",
    category: "Água",
    value: 250,
    dueDate: "2023-02-15",
    status: "pending",
    installments: 1,
    currentInstallment: 1,
    documentNumber: "2023002"
  },
  {
    id: "b3",
    description: "Conta de Luz - Março 2023",
    supplier: "Companhia de Energia",
    category: "Luz",
    value: 400,
    dueDate: "2023-03-20",
    status: "overdue",
    installments: 1,
    currentInstallment: 1,
    documentNumber: "2023003"
  },
  {
    id: "b4",
    description: "Salários - Abril 2023",
    supplier: "Funcionários",
    category: "Salários",
    value: 8000,
    dueDate: "2023-04-30",
    status: "paid",
    paymentDate: "2023-04-28",
    installments: 1,
    currentInstallment: 1,
    documentNumber: "2023004",
    notes: "Pagamento adiantado"
  },
  {
    id: "b5",
    description: "Internet - Maio 2023",
    supplier: "Operadora de Internet",
    category: "Internet",
    value: 300,
    dueDate: "2023-05-10",
    status: "pending",
    installments: 1,
    currentInstallment: 1,
    documentNumber: "2023005"
  }
];

// Mock data for transactions
export const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    description: "Pagamento de mensalidade - Ana Silva",
    amount: 150,
    date: "2023-01-08",
    category: "Mensalidade",
    type: "income",
    paymentMethod: "PIX",
    relatedTo: "p1"
  },
  {
    id: "t2",
    description: "Pagamento de aluguel - Janeiro 2023",
    amount: 3500,
    date: "2023-01-03",
    category: "Aluguel",
    type: "expense",
    paymentMethod: "Transferência Bancária",
    relatedTo: "b1"
  },
  {
    id: "t3",
    description: "Compra de materiais didáticos",
    amount: 500,
    date: "2023-02-15",
    category: "Material",
    type: "expense",
    paymentMethod: "Boleto Bancário"
  },
  {
    id: "t4",
    description: "Recebimento de patrocínio",
    amount: 1000,
    date: "2023-03-01",
    category: "Patrocínios",
    type: "income",
    paymentMethod: "Transferência Bancária"
  },
  {
    id: "t5",
    description: "Pagamento de salários - Abril 2023",
    amount: 8000,
    date: "2023-04-28",
    category: "Salários",
    type: "expense",
    paymentMethod: "Transferência Bancária",
    relatedTo: "b4"
  }
];

// Mock data for enrollments
export const ENROLLMENTS: Enrollment[] = [
  {
    id: "e1",
    studentId: "s1",
    studentName: "Ana Silva",
    modality: "m1",
    modalityName: "Ballet",
    class: "c1",
    className: "Ballet Infantil - Segunda e Quarta",
    enrollmentDate: "2023-01-03",
    date: "2023-01-03",
    status: "active",
    enrollmentFee: 100,
    monthlyFee: 150,
    paymentDay: 10,
    value: 100,
    installments: 1
  },
  {
    id: "e2",
    studentId: "s2",
    studentName: "Pedro Santos",
    modality: "m5",
    modalityName: "Futsal",
    class: "c12",
    className: "Futsal Juvenil - Segunda e Quarta",
    enrollmentDate: "2023-02-28",
    date: "2023-02-28",
    status: "active",
    enrollmentFee: 60,
    monthlyFee: 110,
    paymentDay: 10,
    value: 60,
    installments: 1
  },
  {
    id: "e3",
    studentId: "s3",
    studentName: "Carla Oliveira",
    modality: "m2",
    modalityName: "Jazz",
    class: "c5",
    className: "Jazz Kids - Quarta e Sexta",
    enrollmentDate: "2023-03-15",
    date: "2023-03-15",
    status: "inactive",
    enrollmentFee: 90,
    monthlyFee: 140,
    paymentDay: 10,
    value: 90,
    installments: 1
  },
  {
    id: "e4",
    studentId: "s4",
    studentName: "Lucas Pereira",
    modality: "m3",
    modalityName: "Hip Hop",
    class: "c8",
    className: "Hip Hop Teen - Sexta e Sábado",
    enrollmentDate: "2023-04-01",
    date: "2023-04-01",
    status: "active",
    enrollmentFee: 80,
    monthlyFee: 130,
    paymentDay: 10,
    value: 80,
    installments: 1
  },
  {
    id: "e5",
    studentId: "s5",
    studentName: "Mariana Souza",
    modality: "m4",
    modalityName: "Ginástica",
    class: "c10",
    className: "Ginástica Artística - Terça e Quinta",
    enrollmentDate: "2023-05-10",
    date: "2023-05-10",
    status: "active",
    enrollmentFee: 70,
    monthlyFee: 120,
    paymentDay: 10,
    value: 70,
    installments: 1
  }
];

// Mock data for modalities
export const MODALITIES: Modality[] = [
  {
    id: "m1",
    name: "Ballet",
    description: "Ballet clássico para todas as idades",
    monthlyFee: 150,
    enrollmentFee: 100
  },
  {
    id: "m2",
    name: "Jazz",
    description: "Jazz dance para jovens e adultos",
    monthlyFee: 140,
    enrollmentFee: 90
  },
  {
    id: "m3",
    name: "Hip Hop",
    description: "Hip Hop para todas as idades",
    monthlyFee: 130,
    enrollmentFee: 80
  },
  {
    id: "m4",
    name: "Ginástica",
    description: "Ginástica para crianças e adolescentes",
    monthlyFee: 120,
    enrollmentFee: 70
  },
  {
    id: "m5",
    name: "Futsal",
    description: "Futsal para crianças e adolescentes",
    monthlyFee: 110,
    enrollmentFee: 60
  }
];

// Mock data for classes
export const CLASSES: Class[] = [
  {
    id: "c1",
    name: "Ballet Infantil - Segunda e Quarta",
    modalityId: "m1",
    schedule: "Segunda e Quarta, 14:00 - 15:30",
    teacher: "Professora Carla",
    maxStudents: 15,
    currentStudents: 8
  },
  {
    id: "c2",
    name: "Ballet Infantil - Terça e Quinta",
    modalityId: "m1",
    schedule: "Terça e Quinta, 14:00 - 15:30",
    teacher: "Professora Maria",
    maxStudents: 15,
    currentStudents: 10
  },
  {
    id: "c3",
    name: "Ballet Juvenil - Segunda e Sexta",
    modalityId: "m1",
    schedule: "Segunda e Sexta, 16:00 - 17:30",
    teacher: "Professora Carla",
    maxStudents: 15,
    currentStudents: 12
  },
  {
    id: "c4",
    name: "Ballet Adulto - Sábados",
    modalityId: "m1",
    schedule: "Sábados, 09:00 - 11:00",
    teacher: "Professor Roberto",
    maxStudents: 15,
    currentStudents: 7
  },
  {
    id: "c5",
    name: "Jazz Kids - Quarta e Sexta",
    modalityId: "m2",
    schedule: "Quarta e Sexta, 15:00 - 16:30",
    teacher: "Professora Juliana",
    maxStudents: 12,
    currentStudents: 8
  },
  {
    id: "c6",
    name: "Jazz Teen - Terça e Quinta",
    modalityId: "m2",
    schedule: "Terça e Quinta, 17:00 - 18:30",
    teacher: "Professora Fernanda",
    maxStudents: 12,
    currentStudents: 10
  },
  {
    id: "c7",
    name: "Jazz Adulto - Sábados",
    modalityId: "m2",
    schedule: "Sábados, 11:00 - 13:00",
    teacher: "Professora Juliana",
    maxStudents: 12,
    currentStudents: 6
  },
  {
    id: "c8",
    name: "Hip Hop Teen - Sexta e Sábado",
    modalityId: "m3",
    schedule: "Sexta, 18:00 - 19:30 e Sábado, 14:00 - 15:30",
    teacher: "Professor Lucas",
    maxStudents: 15,
    currentStudents: 13
  },
  {
    id: "c9",
    name: "Hip Hop Adulto - Terça e Quinta",
    modalityId: "m3",
    schedule: "Terça e Quinta, 19:00 - 20:30",
    teacher: "Professor Lucas",
    maxStudents: 15,
    currentStudents: 9
  },
  {
    id: "c10",
    name: "Ginástica Artística - Terça e Quinta",
    modalityId: "m4",
    schedule: "Terça e Quinta, 14:00 - 15:30",
    teacher: "Professor Carlos",
    maxStudents: 12,
    currentStudents: 7
  },
  {
    id: "c11",
    name: "Ginástica Rítmica - Segunda e Quarta",
    modalityId: "m4",
    schedule: "Segunda e Quarta, 15:30 - 17:00",
    teacher: "Professora Ana",
    maxStudents: 12,
    currentStudents: 6
  },
  {
    id: "c12",
    name: "Futsal Juvenil - Segunda e Quarta",
    modalityId: "m5",
    schedule: "Segunda e Quarta, 18:00 - 19:30",
    teacher: "Professor Marcos",
    maxStudents: 14,
    currentStudents: 12
  },
  {
    id: "c13",
    name: "Futsal Infantil - Terça e Quinta",
    modalityId: "m5",
    schedule: "Terça e Quinta, 17:00 - 18:30",
    teacher: "Professor Rodrigo",
    maxStudents: 14,
    currentStudents: 10
  }
];
