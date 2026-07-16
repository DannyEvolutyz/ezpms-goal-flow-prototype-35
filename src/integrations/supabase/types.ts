export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      goal_bank: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean
          target_audience: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          target_audience?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          target_audience?: string
          title?: string
        }
        Relationships: []
      }
      goal_bank_milestones: {
        Row: {
          created_at: string
          description: string | null
          goal_bank_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal_bank_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goal_bank_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_bank_milestones_goal_bank_id_fkey"
            columns: ["goal_bank_id"]
            isOneToOne: false
            referencedRelation: "goal_bank"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_bank_spaces: {
        Row: {
          created_at: string
          goal_bank_id: string
          goal_space_id: string
          id: string
        }
        Insert: {
          created_at?: string
          goal_bank_id: string
          goal_space_id: string
          id?: string
        }
        Update: {
          created_at?: string
          goal_bank_id?: string
          goal_space_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_bank_spaces_goal_bank_id_fkey"
            columns: ["goal_bank_id"]
            isOneToOne: false
            referencedRelation: "goal_bank"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_bank_spaces_goal_space_id_fkey"
            columns: ["goal_space_id"]
            isOneToOne: false
            referencedRelation: "goal_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_spaces: {
        Row: {
          created_at: string
          description: string | null
          edit_end_date: string | null
          edit_start_date: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          rating_deadline: string | null
          rating_start_date: string | null
          review_deadline: string | null
          space_kind: string
          start_date: string | null
          submission_deadline: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          edit_end_date?: string | null
          edit_start_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          rating_deadline?: string | null
          rating_start_date?: string | null
          review_deadline?: string | null
          space_kind?: string
          start_date?: string | null
          submission_deadline?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          edit_end_date?: string | null
          edit_start_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          rating_deadline?: string | null
          rating_start_date?: string | null
          review_deadline?: string | null
          space_kind?: string
          start_date?: string | null
          submission_deadline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_spaces_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "goal_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          created_at: string
          description: string
          feedback: string | null
          id: string
          manager_rated_at: string | null
          origin_space_id: string | null
          priority: string
          rating: number | null
          rating_comment: string | null
          reviewer_id: string | null
          self_rated_at: string | null
          self_rating: number | null
          self_rating_comment: string | null
          source_goal_id: string | null
          space_id: string
          status: string
          target_date: string
          title: string
          updated_at: string
          user_id: string
          weightage: number
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          feedback?: string | null
          id?: string
          manager_rated_at?: string | null
          origin_space_id?: string | null
          priority?: string
          rating?: number | null
          rating_comment?: string | null
          reviewer_id?: string | null
          self_rated_at?: string | null
          self_rating?: number | null
          self_rating_comment?: string | null
          source_goal_id?: string | null
          space_id: string
          status?: string
          target_date: string
          title: string
          updated_at?: string
          user_id: string
          weightage?: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          feedback?: string | null
          id?: string
          manager_rated_at?: string | null
          origin_space_id?: string | null
          priority?: string
          rating?: number | null
          rating_comment?: string | null
          reviewer_id?: string | null
          self_rated_at?: string | null
          self_rating?: number | null
          self_rating_comment?: string | null
          source_goal_id?: string | null
          space_id?: string
          status?: string
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
          weightage?: number
        }
        Relationships: [
          {
            foreignKeyName: "goals_origin_space_id_fkey"
            columns: ["origin_space_id"]
            isOneToOne: false
            referencedRelation: "goal_spaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_source_goal_id_fkey"
            columns: ["source_goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_space_id_fkey"
            columns: ["space_id"]
            isOneToOne: false
            referencedRelation: "goal_spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed: boolean
          completion_comment: string | null
          created_at: string
          description: string | null
          goal_id: string
          id: string
          target_date: string | null
          title: string
        }
        Insert: {
          completed?: boolean
          completion_comment?: string | null
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          target_date?: string | null
          title: string
        }
        Update: {
          completed?: boolean
          completion_comment?: string | null
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          target_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          target_id: string | null
          target_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          target_id?: string | null
          target_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          target_id?: string | null
          target_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          manager_id: string | null
          name: string
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          manager_id?: string | null
          name: string
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          manager_id?: string | null
          name?: string
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "member"],
    },
  },
} as const
