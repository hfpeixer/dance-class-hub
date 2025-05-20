
import React, { useState } from "react";
import { Calendar, Plus, Search, Download, FileText } from "lucide-react";
import { PageTitle } from "@/components/layout/PageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { EventForm } from "./components/EventForm";
import { useEvents } from "./hooks/useEvents";

const EventsPage = () => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent,
    filteredEvents,
    searchTerm,
    setSearchTerm
  } = useEvents();

  const [openEventForm, setOpenEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleAddEditEvent = (eventData: any) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      toast.success(`Evento ${eventData.title} atualizado com sucesso!`);
    } else {
      addEvent(eventData);
      toast.success(`Evento ${eventData.title} cadastrado com sucesso!`);
    }
    setOpenEventForm(false);
    setEditingEvent(null);
  };

  const handleOpenEventForm = (event?: any) => {
    if (event) {
      setEditingEvent(event);
    } else {
      setEditingEvent(null);
    }
    setOpenEventForm(true);
  };

  const handleDeleteEvent = () => {
    if (eventToDelete) {
      const event = events.find(e => e.id === eventToDelete);
      deleteEvent(eventToDelete);
      toast.success(`Evento ${event?.title || ''} removido com sucesso!`);
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6">
      <PageTitle
        title="Eventos"
        subtitle="Gerencie apresentações, espetáculos e eventos especiais"
        icon={Calendar}
      >
        <Button 
          className="bg-dance-primary hover:bg-dance-secondary"
          onClick={() => handleOpenEventForm()}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Evento
        </Button>
      </PageTitle>

      {events.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum evento cadastrado</h3>
              <p className="text-muted-foreground mb-6">
                Cadastre seu primeiro evento ou espetáculo para começar.
              </p>
              <Button 
                className="bg-dance-primary hover:bg-dance-secondary"
                onClick={() => handleOpenEventForm()}
              >
                <Plus className="mr-2 h-4 w-4" /> Cadastrar Evento
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="bg-card border border-border rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-border">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar eventos..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" /> Relatório
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Exportar
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(event.date)}</TableCell>
                      <TableCell>{event.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            event.status === "upcoming"
                              ? "border-blue-500 bg-blue-500/10 text-blue-700"
                              : event.status === "completed"
                              ? "border-green-500 bg-green-500/10 text-green-700"
                              : "border-orange-500 bg-orange-500/10 text-orange-700"
                          }
                        >
                          {event.status === "upcoming" ? "Programado" : 
                           event.status === "completed" ? "Concluído" : "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleOpenEventForm(event)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(event.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Excluir evento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Event Form Dialog */}
      <Dialog open={openEventForm} onOpenChange={setOpenEventForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar Evento" : "Novo Evento"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? "Edite as informações do evento."
                : "Preencha as informações para cadastrar um novo evento."}
            </DialogDescription>
          </DialogHeader>
          <EventForm 
            initialData={editingEvent} 
            onSubmit={handleAddEditEvent} 
            onCancel={() => setOpenEventForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
