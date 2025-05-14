
import React from "react";
import { Calendar, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EventsPage = () => {
  return (
    <div className="p-6">
      <PageTitle
        title="Eventos"
        subtitle="Gerencie apresentações, espetáculos e eventos especiais"
        icon={Calendar}
      >
        <Button className="bg-dance-primary hover:bg-dance-secondary">
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </PageTitle>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhum evento cadastrado</h3>
            <p className="text-muted-foreground mb-6">
              Cadastre seu primeiro evento ou espetáculo para começar.
            </p>
            <Button className="bg-dance-primary hover:bg-dance-secondary">
              <Plus className="mr-2 h-4 w-4" /> Cadastrar Evento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsPage;
