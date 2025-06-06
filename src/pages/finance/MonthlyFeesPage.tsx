
import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { toast } from "sonner";
import { MonthlyFeesList } from "./components/MonthlyFeesList";
import { useMonthlyFees } from "./hooks/useMonthlyFees";

const MonthlyFeesPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const {
    monthlyFees,
    markAsPaid,
    updateOverdueStatus,
    isLoading
  } = useMonthlyFees();

  const handleMarkAsPaid = async (id: string) => {
    try {
      await markAsPaid(id, "Dinheiro");
      toast.success("Mensalidade marcada como paga!");
    } catch (error) {
      console.error('Error marking monthly fee as paid:', error);
    }
  };

  if (isLoading && monthlyFees.length === 0) {
    return (
      <div className="p-6">
        <PageTitle
          title="Mensalidades"
          subtitle="Gerenciar mensalidades geradas automaticamente"
          icon={Calendar}
        />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageTitle
        title="Mensalidades"
        subtitle="Gerenciar mensalidades geradas automaticamente"
        icon={Calendar}
      />

      <MonthlyFeesList
        monthlyFees={monthlyFees}
        onMarkPaid={handleMarkAsPaid}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </div>
  );
};

export default MonthlyFeesPage;
