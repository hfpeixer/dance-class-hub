
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Define the event interface
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  status: 'upcoming' | 'completed' | 'canceled';
  ticketPrice?: number;
  capacity?: number;
  notes?: string;
  created_at?: string;
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<Error | null>(null);

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Note: Currently using local state since events table hasn't been created yet
      // This will be replaced with actual Supabase queries once the events table is created
      
      setTimeout(() => {
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Espetáculo de Fim de Ano',
            description: 'Apresentação de ballet e jazz com todos os alunos',
            date: '2025-12-15',
            time: '19:00',
            location: 'Teatro Municipal',
            status: 'upcoming',
            ticketPrice: 50,
            capacity: 200
          },
          {
            id: '2',
            title: 'Workshop de Dança Contemporânea',
            description: 'Workshop especial com professores convidados',
            date: '2025-06-20',
            time: '14:00',
            location: 'Estúdio Principal',
            status: 'upcoming',
            ticketPrice: 30,
            capacity: 40
          }
        ];
        
        setEvents(mockEvents);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      setIsLoading(false);
      toast.error("Erro ao carregar eventos");
    }
  };

  // Initial data load
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by search term
      return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [events, searchTerm]);

  // Add a new event
  const addEvent = (eventData: Omit<Event, 'id'>) => {
    // Will be replaced with Supabase insert when events table is created
    const newEvent = {
      ...eventData,
      id: uuidv4()
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    toast.success(`Evento ${eventData.title} adicionado com sucesso`);
    return newEvent;
  };

  // Update an existing event
  const updateEvent = (id: string, eventData: Partial<Event>) => {
    // Will be replaced with Supabase update when events table is created
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
    toast.success(`Evento atualizado com sucesso`);
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    // Will be replaced with Supabase delete when events table is created
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    toast.success(`Evento removido com sucesso`);
  };

  return {
    events,
    filteredEvents,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    searchTerm,
    setSearchTerm,
    error,
    refetch: fetchEvents
  };
}
