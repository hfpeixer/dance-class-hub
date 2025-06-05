export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bills: {
        Row: {
          category: string | null
          created_at: string
          description: string
          document_number: string | null
          due_date: string
          id: string
          installment_number: number | null
          notes: string | null
          payment_date: string | null
          status: string
          supplier: string
          total_installments: number | null
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          document_number?: string | null
          due_date: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_date?: string | null
          status?: string
          supplier: string
          total_installments?: number | null
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          document_number?: string | null
          due_date?: string
          id?: string
          installment_number?: number | null
          notes?: string | null
          payment_date?: string | null
          status?: string
          supplier?: string
          total_installments?: number | null
          value?: number
        }
        Relationships: []
      }
      classes: {
        Row: {
          created_at: string
          current_students: number | null
          id: string
          max_students: number | null
          modality_id: string
          name: string
          schedule: string
          teacher: string | null
        }
        Insert: {
          created_at?: string
          current_students?: number | null
          id?: string
          max_students?: number | null
          modality_id: string
          name: string
          schedule: string
          teacher?: string | null
        }
        Update: {
          created_at?: string
          current_students?: number | null
          id?: string
          max_students?: number | null
          modality_id?: string
          name?: string
          schedule?: string
          teacher?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_classes_modality"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          enrollment_fee: number
          id: string
          modality_id: string
          monthly_fee: number
          notes: string | null
          payment_day: number
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          enrollment_fee: number
          id?: string
          modality_id: string
          monthly_fee: number
          notes?: string | null
          payment_day: number
          status?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          enrollment_fee?: number
          id?: string
          modality_id?: string
          monthly_fee?: number
          notes?: string | null
          payment_day?: number
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_modality_id_fkey"
            columns: ["modality_id"]
            isOneToOne: false
            referencedRelation: "modalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string
          date: string
          description: string | null
          id: string
          location: string
          notes: string | null
          status: string
          ticket_price: number | null
          time: string | null
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location: string
          notes?: string | null
          status?: string
          ticket_price?: number | null
          time?: string | null
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          notes?: string | null
          status?: string
          ticket_price?: number | null
          time?: string | null
          title?: string
        }
        Relationships: []
      }
      modalities: {
        Row: {
          created_at: string
          description: string | null
          enrollment_fee: number
          id: string
          monthly_fee: number
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enrollment_fee: number
          id?: string
          monthly_fee: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enrollment_fee?: number
          id?: string
          monthly_fee?: number
          name?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          category: string | null
          created_at: string
          description: string
          due_date: string
          enrollment_id: string | null
          id: string
          installment_number: number | null
          method: string | null
          notes: string | null
          payment_date: string | null
          status: string
          student_id: string
          total_installments: number | null
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          due_date: string
          enrollment_id?: string | null
          id?: string
          installment_number?: number | null
          method?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: string
          student_id: string
          total_installments?: number | null
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          due_date?: string
          enrollment_id?: string | null
          id?: string
          installment_number?: number | null
          method?: string | null
          notes?: string | null
          payment_date?: string | null
          status?: string
          student_id?: string
          total_installments?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          cost: number | null
          created_at: string
          description: string | null
          id: string
          min_stock: number | null
          name: string
          price: number
          status: string
          stock_quantity: number | null
        }
        Insert: {
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name: string
          price: number
          status?: string
          stock_quantity?: number | null
        }
        Update: {
          category?: string | null
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          min_stock?: number | null
          name?: string
          price?: number
          status?: string
          stock_quantity?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          neighborhood: string | null
          phone: string | null
          principal: string | null
          status: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          phone?: string | null
          principal?: string | null
          status?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          phone?: string | null
          principal?: string | null
          status?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          address: string | null
          age: number | null
          birthday: string | null
          city_state: string | null
          class: string | null
          created_at: string
          email: string | null
          enrollment_date: string | null
          id: string
          modality: string | null
          name: string
          notes: string | null
          parent_cpf: string | null
          parent_name: string | null
          parent_phone: string | null
          phone: string | null
          status: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          age?: number | null
          birthday?: string | null
          city_state?: string | null
          class?: string | null
          created_at?: string
          email?: string | null
          enrollment_date?: string | null
          id?: string
          modality?: string | null
          name: string
          notes?: string | null
          parent_cpf?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          phone?: string | null
          status?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          age?: number | null
          birthday?: string | null
          city_state?: string | null
          class?: string | null
          created_at?: string
          email?: string | null
          enrollment_date?: string | null
          id?: string
          modality?: string | null
          name?: string
          notes?: string | null
          parent_cpf?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          phone?: string | null
          status?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          category: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          resource: string
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          resource: string
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          resource?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          commission_per_student: number | null
          created_at: string
          email: string | null
          hire_date: string | null
          id: string
          name: string
          notes: string | null
          payment_type: string | null
          phone: string | null
          salary: number | null
          specialties: string[] | null
          status: string
        }
        Insert: {
          commission_per_student?: number | null
          created_at?: string
          email?: string | null
          hire_date?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_type?: string | null
          phone?: string | null
          salary?: number | null
          specialties?: string[] | null
          status?: string
        }
        Update: {
          commission_per_student?: number | null
          created_at?: string
          email?: string | null
          hire_date?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_type?: string | null
          phone?: string | null
          salary?: number | null
          specialties?: string[] | null
          status?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string
          id: string
          notes: string | null
          payment_method: string | null
          related_to: string | null
          type: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date: string
          description: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          related_to?: string | null
          type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          related_to?: string | null
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_age: {
        Args: { birth_date: string }
        Returns: number
      }
      can_manage_users: {
        Args: { _user_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_management_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          name: string
          avatar: string
          role: Database["public"]["Enums"]["app_role"]
          created_at: string
          last_sign_in_at: string
          email_confirmed_at: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_user_action: {
        Args: {
          _action: string
          _resource: string
          _resource_id?: string
          _details?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "secretary" | "financial" | "teacher"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "secretary", "financial", "teacher"],
    },
  },
} as const
