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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      field_approval_config: {
        Row: {
          created_at: string
          division: string | null
          field_id: string
          id: string
          required_role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          division?: string | null
          field_id: string
          id?: string
          required_role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          division?: string | null
          field_id?: string
          id?: string
          required_role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      field_approvals: {
        Row: {
          approved_by: string | null
          approver_role: Database["public"]["Enums"]["app_role"]
          comment: string | null
          created_at: string
          field_id: string
          id: string
          status: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approver_role: Database["public"]["Enums"]["app_role"]
          comment?: string | null
          created_at?: string
          field_id: string
          id?: string
          status?: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approver_role?: Database["public"]["Enums"]["app_role"]
          comment?: string | null
          created_at?: string
          field_id?: string
          id?: string
          status?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_approvals_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "npd_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      npd_submissions: {
        Row: {
          approved_at: string | null
          barcode: string | null
          created_at: string
          created_by: string | null
          division: string
          form_data: Json
          id: string
          product_name_en: string
          product_name_th: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          submitted_at: string | null
          supplier_name: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          barcode?: string | null
          created_at?: string
          created_by?: string | null
          division: string
          form_data?: Json
          id?: string
          product_name_en: string
          product_name_th?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          supplier_name?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          barcode?: string | null
          created_at?: string
          created_by?: string | null
          division?: string
          form_data?: Json
          id?: string
          product_name_en?: string
          product_name_th?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          submitted_at?: string | null
          supplier_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      npd_workflow_history: {
        Row: {
          action: string
          comment: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["workflow_status"] | null
          id: string
          performed_by: string | null
          performed_by_role: string | null
          submission_id: string
          to_status: Database["public"]["Enums"]["workflow_status"]
        }
        Insert: {
          action: string
          comment?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["workflow_status"] | null
          id?: string
          performed_by?: string | null
          performed_by_role?: string | null
          submission_id: string
          to_status: Database["public"]["Enums"]["workflow_status"]
        }
        Update: {
          action?: string
          comment?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["workflow_status"] | null
          id?: string
          performed_by?: string | null
          performed_by_role?: string | null
          submission_id?: string
          to_status?: Database["public"]["Enums"]["workflow_status"]
        }
        Relationships: [
          {
            foreignKeyName: "npd_workflow_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "npd_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
          must_change_password: boolean
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          must_change_password?: boolean
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          must_change_password?: boolean
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      user_departments: {
        Row: {
          created_at: string
          department_code: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department_code: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department_code?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_departments_department_code_fkey"
            columns: ["department_code"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["code"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          user_id?: string
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
      user_suppliers: {
        Row: {
          created_at: string
          id: string
          supplier_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          supplier_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          supplier_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "supplier"
        | "buyer"
        | "commercial"
        | "finance"
        | "scm"
        | "im"
        | "dc_income"
        | "admin"
        | "nsd"
      permission_type:
        | "can_approve"
        | "can_reject"
        | "can_revise"
        | "can_view_all_depts"
        | "can_export"
        | "can_access_reports"
      user_status: "active" | "inactive" | "locked"
      user_type: "internal" | "external"
      workflow_status:
        | "draft"
        | "pending_buyer"
        | "pending_commercial"
        | "pending_finance"
        | "approved"
        | "rejected"
        | "revision_needed"
        | "pending_secondary"
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
      app_role: [
        "supplier",
        "buyer",
        "commercial",
        "finance",
        "scm",
        "im",
        "dc_income",
        "admin",
        "nsd",
      ],
      permission_type: [
        "can_approve",
        "can_reject",
        "can_revise",
        "can_view_all_depts",
        "can_export",
        "can_access_reports",
      ],
      user_status: ["active", "inactive", "locked"],
      user_type: ["internal", "external"],
      workflow_status: [
        "draft",
        "pending_buyer",
        "pending_commercial",
        "pending_finance",
        "approved",
        "rejected",
        "revision_needed",
        "pending_secondary",
      ],
    },
  },
} as const
