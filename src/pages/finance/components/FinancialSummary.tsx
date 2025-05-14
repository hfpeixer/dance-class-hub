
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FinancialSummaryProps {
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  totalCount: number;
}

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  totalReceived,
  totalPending,
  totalOverdue,
  totalCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="flex-1 min-w-[200px]">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Total de Mensalidades
          </div>
          <div className="text-2xl font-bold mt-2">{totalCount}</div>
        </CardContent>
      </Card>
      
      <Card className="flex-1 min-w-[200px]">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Recebido
          </div>
          <div className="text-2xl font-bold mt-2 text-green-500">
            R$ {totalReceived.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex-1 min-w-[200px]">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Pendente
          </div>
          <div className="text-2xl font-bold mt-2 text-yellow-500">
            R$ {totalPending.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex-1 min-w-[200px]">
        <CardContent className="flex flex-col justify-between p-6">
          <div className="text-sm font-medium text-muted-foreground">
            Atrasado
          </div>
          <div className="text-2xl font-bold mt-2 text-red-500">
            R$ {totalOverdue.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
