
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Bill } from "../models/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch bills from Supabase
  useEffect(() => {
    const fetchBills = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('bills')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          const formattedBills: Bill[] = data.map((bill: any) => ({
            id: bill.id,
            description: bill.description,
            supplier: bill.supplier,
            category: bill.category || '',
            value: bill.value,
            dueDate: bill.due_date,
            installments: bill.total_installments || 1,
            status: bill.status as "paid" | "pending" | "overdue" | "cancelled",
            paymentDate: bill.payment_date,
            notes: bill.notes,
            currentInstallment: bill.installment_number,
            documentNumber: bill.document_number
          }));
          
          setBills(formattedBills);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch bills'));
        setIsLoading(false);
        toast.error("Erro ao carregar contas");
      }
    };
    
    fetchBills();
  }, []);

  // Verify overdue bills daily
  useEffect(() => {
    updateBillStatuses();
  }, []);

  const updateBillStatuses = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
      // Get all pending bills
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('status', 'pending');
      
      if (error) throw error;
      
      if (data) {
        for (const bill of data) {
          const dueDate = new Date(bill.due_date);
          dueDate.setHours(0, 0, 0, 0);
          
          if (dueDate < today) {
            // Update bill status to overdue in Supabase
            const { error: updateError } = await supabase
              .from('bills')
              .update({ status: 'overdue' })
              .eq('id', bill.id);
            
            if (updateError) throw updateError;
          }
        }
        
        // Refresh bills after updates
        const { data: updatedData, error: refreshError } = await supabase
          .from('bills')
          .select('*');
        
        if (refreshError) throw refreshError;
        
        if (updatedData) {
          const formattedBills: Bill[] = updatedData.map((bill: any) => ({
            id: bill.id,
            description: bill.description,
            supplier: bill.supplier,
            category: bill.category || '',
            value: bill.value,
            dueDate: bill.due_date,
            installments: bill.total_installments || 1,
            status: bill.status as "paid" | "pending" | "overdue" | "cancelled",
            paymentDate: bill.payment_date,
            notes: bill.notes,
            currentInstallment: bill.installment_number,
            documentNumber: bill.document_number
          }));
          
          setBills(formattedBills);
        }
      }
    } catch (err) {
      console.error("Error updating bill statuses:", err);
      setError(err instanceof Error ? err : new Error('Failed to update bill statuses'));
    }
  };

  const addBill = async (bill: Omit<Bill, "id" | "status">) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbBill = {
        description: bill.description,
        supplier: bill.supplier,
        category: bill.category,
        value: bill.value,
        due_date: bill.dueDate,
        total_installments: bill.installments,
        status: 'pending',
        payment_date: null,
        notes: bill.notes,
        installment_number: bill.currentInstallment,
        document_number: bill.documentNumber
      };
      
      const { data, error } = await supabase
        .from('bills')
        .insert(dbBill)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const newBill: Bill = {
          id: data[0].id,
          description: data[0].description,
          supplier: data[0].supplier,
          category: data[0].category || '',
          value: data[0].value,
          dueDate: data[0].due_date,
          installments: data[0].total_installments || 1,
          status: data[0].status as "paid" | "pending" | "overdue" | "cancelled",
          paymentDate: data[0].payment_date,
          notes: data[0].notes,
          currentInstallment: data[0].installment_number,
          documentNumber: data[0].document_number
        };
        
        setBills(prevBills => [...prevBills, newBill]);
        toast.success("Conta adicionada com sucesso");
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error adding bill:", err);
      setError(err instanceof Error ? err : new Error('Failed to add bill'));
      setIsLoading(false);
      toast.error("Erro ao adicionar conta");
    }
  };

  const updateBill = async (id: string, updatedBill: Partial<Bill>) => {
    setIsLoading(true);
    
    try {
      // Convert frontend format to database format
      const dbBill: any = {};
      
      if (updatedBill.description !== undefined) dbBill.description = updatedBill.description;
      if (updatedBill.supplier !== undefined) dbBill.supplier = updatedBill.supplier;
      if (updatedBill.category !== undefined) dbBill.category = updatedBill.category;
      if (updatedBill.value !== undefined) dbBill.value = updatedBill.value;
      if (updatedBill.dueDate !== undefined) dbBill.due_date = updatedBill.dueDate;
      if (updatedBill.installments !== undefined) dbBill.total_installments = updatedBill.installments;
      if (updatedBill.status !== undefined) dbBill.status = updatedBill.status;
      if (updatedBill.paymentDate !== undefined) dbBill.payment_date = updatedBill.paymentDate;
      if (updatedBill.notes !== undefined) dbBill.notes = updatedBill.notes;
      if (updatedBill.currentInstallment !== undefined) dbBill.installment_number = updatedBill.currentInstallment;
      if (updatedBill.documentNumber !== undefined) dbBill.document_number = updatedBill.documentNumber;
      
      const { error } = await supabase
        .from('bills')
        .update(dbBill)
        .eq('id', id);
      
      if (error) throw error;
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === id ? { ...bill, ...updatedBill } : bill
        )
      );
      
      toast.success("Conta atualizada com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error updating bill:", err);
      setError(err instanceof Error ? err : new Error('Failed to update bill'));
      setIsLoading(false);
      toast.error("Erro ao atualizar conta");
    }
  };

  const deleteBill = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBills(prevBills => 
        prevBills.filter(bill => bill.id !== id)
      );
      
      toast.success("Conta removida com sucesso");
      setIsLoading(false);
    } catch (err) {
      console.error("Error deleting bill:", err);
      setError(err instanceof Error ? err : new Error('Failed to delete bill'));
      setIsLoading(false);
      toast.error("Erro ao remover conta");
    }
  };

  const markBillAsPaid = async (id: string, paymentMethod?: string) => {
    setIsLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const { error } = await supabase
        .from('bills')
        .update({
          status: 'paid',
          payment_date: today
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setBills(prevBills => 
        prevBills.map(bill => 
          bill.id === id ? {
            ...bill,
            status: 'paid',
            paymentDate: today
          } : bill
        )
      );
      
      toast.success("Conta marcada como paga");
      setIsLoading(false);
    } catch (err) {
      console.error("Error marking bill as paid:", err);
      setError(err instanceof Error ? err : new Error('Failed to mark bill as paid'));
      setIsLoading(false);
      toast.error("Erro ao marcar conta como paga");
    }
  };

  const getBillsByStatus = (status: "paid" | "pending" | "overdue" | "all") => {
    if (status === "all") return bills;
    return bills.filter(bill => bill.status === status);
  };

  return {
    bills,
    addBill,
    updateBill,
    deleteBill,
    markBillAsPaid,
    updateBillStatuses,
    getBillsByStatus,
    isLoading,
    error
  };
};
