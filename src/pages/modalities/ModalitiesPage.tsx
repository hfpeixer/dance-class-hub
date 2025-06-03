
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

interface Modality {
  id: string;
  name: string;
  monthlyFee: number;
  students: number;
  classes: number;
  colorClass: string;
}

const ModalitiesPage = () => {
  const [modalities, setModalities] = useState<Modality[]>([
    {
      id: "1",
      name: "Ballet",
      monthlyFee: 150,
      students: 45,
      classes: 4,
      colorClass: "bg-modalidades-ballet",
    },
    {
      id: "2",
      name: "Jazz",
      monthlyFee: 140,
      students: 30,
      classes: 3,
      colorClass: "bg-modalidades-jazz",
    },
    {
      id: "3",
      name: "Ginástica Artística",
      monthlyFee: 160,
      students: 25,
      classes: 3,
      colorClass: "bg-modalidades-ginastica",
    },
    {
      id: "4",
      name: "Ginástica Rítmica",
      monthlyFee: 160,
      students: 20,
      classes: 2,
      colorClass: "bg-modalidades-ritmica",
    },
    {
      id: "5",
      name: "Futsal",
      monthlyFee: 120,
      students: 35,
      classes: 4,
      colorClass: "bg-modalidades-futsal",
    },
  ]);

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

  const handleSubmit = (values: any) => {
    if (editingModality) {
      const updatedModalities = modalities.map((m) =>
        m.id === editingModality.id
          ? { ...m, ...values }
          : m
      );
      setModalities(updatedModalities);
      toast.success("Modalidade atualizada com sucesso!");
    } else {
      const newModality: Modality = {
        id: Date.now().toString(),
        ...values,
        students: 0,
        classes: 0,
      };
      setModalities([...modalities, newModality]);
      toast.success("Modalidade cadastrada com sucesso!");
    }
    handleCloseDialog();
  };

  const confirmDelete = (id: string) => {
    setModalityToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const deleteModality = () => {
    if (modalityToDelete) {
      setModalities(modalities.filter((m) => m.id !== modalityToDelete));
      toast.success("Modalidade removida com sucesso!");
      setDeleteConfirmOpen(false);
      setModalityToDelete(null);
    }
  };

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
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteModality}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalitiesPage;
