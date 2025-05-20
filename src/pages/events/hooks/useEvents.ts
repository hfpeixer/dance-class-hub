
import { useState, useMemo } from 'react';
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

  // Fetch events from mock data for now
  // In the future, this will connect to Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    // For now, using local mock data
    // This will be replaced with Supabase when the table is created
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
  };

  // Initial data load
  useState(() => {
    fetchEvents();
  });

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
    const newEvent = {
      ...eventData,
      id: uuidv4()
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  // Update an existing event
  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  // Delete an event
  const deleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
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
