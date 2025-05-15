
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../models/types';
import { TRANSACTIONS } from '../models/mockData';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id ? { ...transaction, ...updatedTransaction, id } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};
