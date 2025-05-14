
import React from "react";
import { School, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SchoolsPage = () => {
  return (
    <div className="p-6">
      <PageTitle
        title="Escolas"
        subtitle="Gerencie as unidades e escolas do sistema"
        icon={School}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Nova Escola
        </Button>
      </PageTitle>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <School className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma escola cadastrada</h3>
            <p className="text-muted-foreground mb-6">
              Cadastre sua primeira escola ou unidade para começar.
            </p>
            <Button className="bg-dance-primary hover:bg-dance-secondary">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Escola
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolsPage;
