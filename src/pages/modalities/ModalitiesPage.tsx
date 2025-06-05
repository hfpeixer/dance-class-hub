
import React, { useState } from "react";
import { Music2, Plus } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ModalityForm } from "./components/ModalityForm";
import { ModalityCard } from "./components/ModalityCard";
import { useModalities, Modality } from "./hooks/useModalities";

const ModalitiesPage = () => {
  const { modalities, isLoading, addModality, updateModality, deleteModality } = useModalities();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingModality, setEditingModality] = useState<Modality | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [modalityToDelete, setModalityToDelete] = useState<string | null>(null);

  const handleOpenDialog = (modality?: Modality) => {
    setEditingModality(modality || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingModality(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingModality) {
        await updateModality(editingModality.id, values);
      } else {
        await addModality(values);
      }
      handleCloseDialog();
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const confirmDelete = (id: string) => {
    setModalityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (modalityToDelete) {
      try {
        await deleteModality(modalityToDelete);
        setDeleteConfirmOpen(false);
        setModalityToDelete(null);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PageTitle
          title="Modalidades"
          subtitle="Gerencie as modalidades de dança e esportes oferecidas"
          icon={Music2}
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
        title="Modalidades"
        subtitle="Gerencie as modalidades de dança e esportes oferecidas"
        icon={Music2}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenDialog()}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
        </Button>
      </PageTitle>

      {modalities.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Music2 className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma modalidade cadastrada
          </h3>
          <p className="text-gray-500 mb-4">
            Comece criando a primeira modalidade da sua escola.
          </p>
          <Button 
            className="bg-dance-primary hover:bg-dance-secondary"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova Modalidade
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modalities.map((modality) => (
            <ModalityCard
              key={modality.id}
              modality={modality}
              onEdit={handleOpenDialog}
              onDelete={confirmDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingModality ? "Editar Modalidade" : "Nova Modalidade"}
            </DialogTitle>
            <DialogDescription>
              {editingModality
                ? "Edite as informações da modalidade."
                : "Preencha as informações para cadastrar uma nova modalidade."}
            </DialogDescription>
          </DialogHeader>
          <ModalityForm
            initialData={editingModality}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta modalidade? Esta ação não pode ser desfeita.
              Modalidades com matrículas ativas não podem ser excluídas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalitiesPage;
