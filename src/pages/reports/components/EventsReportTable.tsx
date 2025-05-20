
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const EventsReportTable = () => {
  // This would normally come from a custom hook or API call
  const events = [
    {
      id: "1",
      title: "Espetáculo de Fim de Ano",
      description: "Apresentação de ballet e jazz com todos os alunos",
      date: "2024-12-15",
      location: "Teatro Municipal",
      status: "upcoming",
      ticketPrice: 50.00,
      capacity: 200,
      registeredAttendees: 0
    },
    {
      id: "2",
      title: "Workshop de Dança Contemporânea",
      description: "Workshop especial com professores convidados",
      date: "2024-06-20",
      location: "Estúdio Principal",
      status: "upcoming",
      ticketPrice: 30.00,
      capacity: 40,
      registeredAttendees: 15
    },
    {
      id: "3",
      title: "Competição Regional de Ballet",
      description: "Participação dos alunos avançados na competição regional",
      date: "2024-04-10",
      location: "Centro de Convenções",
      status: "completed",
      ticketPrice: null,
      capacity: null,
      registeredAttendees: 12
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Capacidade</TableHead>
            <TableHead>Preço do Ingresso</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
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
                {event.capacity 
                  ? `${event.registeredAttendees}/${event.capacity}` 
                  : "N/A"}
              </TableCell>
              <TableCell>{formatCurrency(event.ticketPrice)}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
