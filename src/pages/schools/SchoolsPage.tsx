
import React, { useState } from "react";
import { School, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSchools } from "./hooks/useSchools";
import { SchoolForm } from "./components/SchoolForm";
import { SchoolCard } from "./components/SchoolCard";
import { EmptySchoolsState } from "./components/EmptySchoolsState";
import type { School as SchoolType } from "./hooks/useSchools";

const SchoolsPage = () => {
  const { schools, addSchool, updateSchool, deleteSchool, isLoading } = useSchools();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolType | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);

  const handleOpenDialog = (school?: SchoolType) => {
    setEditingSchool(school || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchool(null);
  };

  const handleSubmit = async (values: any) => {
    if (editingSchool) {
      await updateSchool(editingSchool.id, values);
    } else {
      await addSchool({ ...values, status: "active" });
    }
    handleCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setSchoolToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (schoolToDelete) {
      await deleteSchool(schoolToDelete);
      setDeleteConfirmOpen(false);
      setSchoolToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Escolas"
        subtitle="Gerencie as unidades e escolas do sistema"
        icon={School}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenDialog()}
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Escola
        </Button>
      </PageTitle>

      {schools.length === 0 ? (
        <EmptySchoolsState onAddSchool={() => handleOpenDialog()} isLoading={isLoading} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {schools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              onEdit={handleOpenDialog}
              onDelete={confirmDelete}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? "Editar Escola" : "Nova Escola"}
            </DialogTitle>
            <DialogDescription>
              {editingSchool
                ? "Edite as informações da escola."
                : "Preencha as informações para cadastrar uma nova escola."}
            </DialogDescription>
          </DialogHeader>
          <SchoolForm
            initialData={editingSchool}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta escola? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolsPage;
