
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from "../models/types";
import { TRANSACTIONS } from "../models/mockData";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4()
    };
    setTransactions([...transactions, newTransaction]);
    return newTransaction;
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(transactions.map((transaction) => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const getTransactionsByType = (type: "income" | "expense" | "all") => {
    if (type === "all") return transactions;
    return transactions.filter(transaction => transaction.type === type);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const calculateTotalByType = (type: "income" | "expense") => {
    return transactions
      .filter(t => t.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByDateRange,
    calculateTotalByType
  };
};
