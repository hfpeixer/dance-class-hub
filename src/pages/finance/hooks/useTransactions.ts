
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const formattedTransactions: Transaction[] = data.map((transaction: any) => ({
            id: transaction.id,
            description: transaction.description,
            amount: transaction.amount,
            date: transaction.date,
            category: transaction.category || '',
            type: transaction.type as "income" | "expense",
            paymentMethod: transaction.payment_method,
            notes: transaction.notes,
            relatedTo: transaction.related_to
          }));
          
          setTransactions(formattedTransactions);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
        setIsLoading(false);
        toast.error("Erro ao carregar transações");
      }
    };
    
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbTransaction = {
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        type: transaction.type,
        payment_method: transaction.paymentMethod,
        notes: transaction.notes,
        related_to: transaction.relatedTo
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(dbTransaction)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newTransaction: Transaction = {
          id: data[0].id,
          description: data[0].description,
          amount: data[0].amount,
          date: data[0].date,
          category: data[0].category || '',
          type: data[0].type as "income" | "expense",
          paymentMethod: data[0].payment_method,
          notes: data[0].notes,
          relatedTo: data[0].related_to
        };
        
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        toast.success("Transação adicionada com sucesso");
      }
      
      setIsLoading(false);
      return data?.[0];
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError(err instanceof Error ? err : new Error('Failed to add transaction'));
      setIsLoading(false);
      toast.error("Erro ao adicionar transação");
      return null;
    }
  };

  const updateTransaction = async (id: string, updatedTransaction: Partial<Transaction>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbTransaction: any = {};
      
      if (updatedTransaction.description !== undefined) dbTransaction.description = updatedTransaction.description;
      if (updatedTransaction.amount !== undefined) dbTransaction.amount = updatedTransaction.amount;
      if (updatedTransaction.date !== undefined) dbTransaction.date = updatedTransaction.date;
      if (updatedTransaction.category !== undefined) dbTransaction.category = updatedTransaction.category;
      if (updatedTransaction.type !== undefined) dbTransaction.type = updatedTransaction.type;
      if (updatedTransaction.paymentMethod !== undefined) dbTransaction.payment_method = updatedTransaction.paymentMethod;
      if (updatedTransaction.notes !== undefined) dbTransaction.notes = updatedTransaction.notes;
      if (updatedTransaction.relatedTo !== undefined) dbTransaction.related_to = updatedTransaction.relatedTo;
      
      const { error } = await supabase
        .from('transactions')
        .update(dbTransaction)
        .eq('id', id);
      
      if (error) throw error;
      
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
        )
      );
      
      toast.success("Transação atualizada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError(err instanceof Error ? err : new Error('Failed to update transaction'));
      setIsLoading(false);
      toast.error("Erro ao atualizar transação");
    }
  };

  const deleteTransaction = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
      
      toast.success("Transação removida com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete transaction'));
      setIsLoading(false);
      toast.error("Erro ao remover transação");
    }
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
    calculateTotalByType,
    isLoading,
    error
  };
};
