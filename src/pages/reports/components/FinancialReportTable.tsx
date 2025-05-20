
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const FinancialReportTable = () => {
  // This would normally come from a custom hook or API call
  const transactions = [
    {
      id: "1",
      description: "Mensalidade - Ana Silva",
      amount: 150.00,
      type: "income",
      date: "2024-05-10",
      category: "Mensalidades",
      paymentMethod: "Pix"
    },
    {
      id: "2",
      description: "Matrícula - Pedro Santos",
      amount: 100.00,
      type: "income",
      date: "2024-05-08",
      category: "Matrículas",
      paymentMethod: "Cartão de Crédito"
    },
    {
      id: "3",
      description: "Pagamento professor - Ballet",
      amount: 1200.00,
      type: "expense",
      date: "2024-05-05",
      category: "Salários",
      paymentMethod: "Transferência"
    },
    {
      id: "4",
      description: "Aluguel do estúdio",
      amount: 2000.00,
      type: "expense",
      date: "2024-05-01",
      category: "Aluguel",
      paymentMethod: "Débito Automático"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <p className="text-green-700 text-sm font-medium">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(250)}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
          <p className="text-red-700 text-sm font-medium">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-700">{formatCurrency(3200)}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
          <p className="text-blue-700 text-sm font-medium">Saldo</p>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(-2950)}</p>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Forma de Pagamento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>{transaction.paymentMethod}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    transaction.type === "income"
                      ? "border-green-500 bg-green-500/10 text-green-700"
                      : "border-red-500 bg-red-500/10 text-red-700"
                  }
                >
                  {transaction.type === "income" ? "Receita" : "Despesa"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
