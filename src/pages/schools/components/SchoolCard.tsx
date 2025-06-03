
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { School } from "../hooks/useSchools";

interface SchoolCardProps {
  school: School;
  onEdit: (school: School) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          {school.address && <p>{school.address}</p>}
          {school.neighborhood && <p>Bairro: {school.neighborhood}</p>}
          {school.city && <p>Cidade: {school.city}</p>}
          {school.phone && <p>Tel: {school.phone}</p>}
          {school.email && <p>Email: {school.email}</p>}
          {school.principal && <p>Diretor: {school.principal}</p>}
        </div>
        <div className="flex mt-4 space-x-2 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(school)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(school.id)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
