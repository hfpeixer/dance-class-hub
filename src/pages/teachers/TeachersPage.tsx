
import React from "react";
import { UserCheck, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TeachersPage = () => {
  return (
    <div className="p-6">
      <PageTitle
        title="Professores"
        subtitle="Gerencie os professores do sistema"
        icon={UserCheck}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Professor
        </Button>
      </PageTitle>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <UserCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum professor cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Cadastre seu primeiro professor para começar.
            </p>
            <Button className="bg-dance-primary hover:bg-dance-secondary">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Professor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPage;
