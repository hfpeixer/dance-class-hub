
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      console.log("Fetching events from Supabase...");
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Supabase error fetching events:", error);
        throw error;
      }
      
      console.log("Events fetched successfully:", data);
      
      if (data) {
        const formattedEvents: Event[] = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description || '',
          date: event.date,
          time: event.time || '',
          location: event.location,
          status: event.status as 'upcoming' | 'completed' | 'canceled',
          ticketPrice: event.ticket_price || 0,
          capacity: event.capacity || 0,
          notes: event.notes || '',
          created_at: event.created_at
        }));
        
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch events'));
      toast.error("Erro ao carregar eventos");
    } finally {
      setIsLoading(false);
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
  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    setIsLoading(true);
    
    try {
      console.log("Adding new event:", eventData);
      
      // Convert frontend format to database format
      const dbEvent = {
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date,
        time: eventData.time || '',
        location: eventData.location,
        status: eventData.status || 'upcoming',
        ticket_price: eventData.ticketPrice || 0,
        capacity: eventData.capacity || 0,
        notes: eventData.notes || ''
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(dbEvent)
        .select();
      
      if (error) {
        console.error("Supabase error adding event:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newEvent: Event = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description || '',
          date: data[0].date,
          time: data[0].time || '',
          location: data[0].location,
          status: data[0].status as 'upcoming' | 'completed' | 'canceled',
          ticketPrice: data[0].ticket_price || 0,
          capacity: data[0].capacity || 0,
          notes: data[0].notes || '',
          created_at: data[0].created_at
        };
        
        setEvents(prevEvents => [...prevEvents, newEvent]);
        toast.success(`Evento ${eventData.title} adicionado com sucesso`);
        return newEvent;
      }
    } catch (err) {
      console.error("Error adding event:", err);
      toast.error("Erro ao adicionar evento");
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    setIsLoading(true);
    
    try {
      console.log("Updating event:", id, eventData);
      
      // Convert frontend format to database format
      const dbEvent: any = {};
      
      if (eventData.title !== undefined) dbEvent.title = eventData.title;
      if (eventData.description !== undefined) dbEvent.description = eventData.description;
      if (eventData.date !== undefined) dbEvent.date = eventData.date;
      if (eventData.time !== undefined) dbEvent.time = eventData.time;
      if (eventData.location !== undefined) dbEvent.location = eventData.location;
      if (eventData.status !== undefined) dbEvent.status = eventData.status;
      if (eventData.ticketPrice !== undefined) dbEvent.ticket_price = eventData.ticketPrice;
      if (eventData.capacity !== undefined) dbEvent.capacity = eventData.capacity;
      if (eventData.notes !== undefined) dbEvent.notes = eventData.notes;
      
      const { error } = await supabase
        .from('events')
        .update(dbEvent)
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error updating event:", error);
        throw error;
      }
      
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === id ? { ...event, ...eventData } : event
        )
      );
      
      toast.success(`Evento atualizado com sucesso`);
    } catch (err) {
      console.error("Error updating event:", err);
      toast.error("Erro ao atualizar evento");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (id: string) => {
    setIsLoading(true);
    
    try {
      console.log("Deleting event:", id);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error deleting event:", error);
        throw error;
      }
      
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      toast.success(`Evento removido com sucesso`);
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Erro ao remover evento");
    } finally {
      setIsLoading(false);
    }
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
