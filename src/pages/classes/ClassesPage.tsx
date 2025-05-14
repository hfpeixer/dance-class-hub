
import React from "react";
import { BookOpen, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ClassesPage = () => {
  return (
    <div className="p-6">
      <PageTitle
        title="Turmas"
        subtitle="Gerencie as turmas do sistema"
        icon={BookOpen}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Nova Turma
        </Button>
      </PageTitle>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma turma cadastrada</h3>
            <p className="text-muted-foreground mb-6">
              Cadastre sua primeira turma para começar.
            </p>
            <Button className="bg-dance-primary hover:bg-dance-secondary">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Turma
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassesPage;
