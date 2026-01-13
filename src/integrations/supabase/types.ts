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
      availability_requests: {
        Row: {
          created_at: string
          day_of_week: number
          effective_from: string
          effective_until: string | null
          id: string
          inbound_time: string | null
          notes: string | null
          outbound_time: string | null
          passenger_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          effective_from?: string
          effective_until?: string | null
          id?: string
          inbound_time?: string | null
          notes?: string | null
          outbound_time?: string | null
          passenger_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          effective_from?: string
          effective_until?: string | null
          id?: string
          inbound_time?: string | null
          notes?: string | null
          outbound_time?: string | null
          passenger_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_requests_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passengers"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          building_note: string | null
          city: string | null
          company_name: string
          created_at: string
          id: string
          is_active: boolean
          latitude: number
          longitude: number
          province: string | null
          site_name: string | null
          street: string
          suburb: string | null
          updated_at: string
        }
        Insert: {
          building_note?: string | null
          city?: string | null
          company_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude: number
          longitude: number
          province?: string | null
          site_name?: string | null
          street: string
          suburb?: string | null
          updated_at?: string
        }
        Update: {
          building_note?: string | null
          city?: string | null
          company_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number
          longitude?: number
          province?: string | null
          site_name?: string | null
          street?: string
          suburb?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      driver_locations: {
        Row: {
          accuracy: number | null
          driver_id: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          speed: number | null
          trip_id: string | null
        }
        Insert: {
          accuracy?: number | null
          driver_id: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          speed?: number | null
          trip_id?: string | null
        }
        Update: {
          accuracy?: number | null
          driver_id?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          speed?: number | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_locations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_online: boolean
          license_number: string | null
          license_plate: string | null
          updated_at: string
          user_id: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_photo_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_online?: boolean
          license_number?: string | null
          license_plate?: string | null
          updated_at?: string
          user_id: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_photo_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_online?: boolean
          license_number?: string | null
          license_plate?: string | null
          updated_at?: string
          user_id?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_photo_url?: string | null
        }
        Relationships: []
      }
      passengers: {
        Row: {
          account_status: string
          address_confidence: string | null
          company: string | null
          company_id: string | null
          created_at: string
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          home_address: string | null
          home_city: string | null
          home_house_number: string | null
          home_lat: number | null
          home_lng: number | null
          home_province: string | null
          home_street: string | null
          home_suburb: string | null
          id: string
          is_active: boolean
          onboarding_completed: boolean
          payment_status: string
          pickup_notes: string | null
          ride_type: string
          shift_type: string | null
          updated_at: string
          user_id: string
          work_address: string | null
          work_lat: number | null
          work_lng: number | null
        }
        Insert: {
          account_status?: string
          address_confidence?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          home_address?: string | null
          home_city?: string | null
          home_house_number?: string | null
          home_lat?: number | null
          home_lng?: number | null
          home_province?: string | null
          home_street?: string | null
          home_suburb?: string | null
          id?: string
          is_active?: boolean
          onboarding_completed?: boolean
          payment_status?: string
          pickup_notes?: string | null
          ride_type?: string
          shift_type?: string | null
          updated_at?: string
          user_id: string
          work_address?: string | null
          work_lat?: number | null
          work_lng?: number | null
        }
        Update: {
          account_status?: string
          address_confidence?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          home_address?: string | null
          home_city?: string | null
          home_house_number?: string | null
          home_lat?: number | null
          home_lng?: number | null
          home_province?: string | null
          home_street?: string | null
          home_suburb?: string | null
          id?: string
          is_active?: boolean
          onboarding_completed?: boolean
          payment_status?: string
          pickup_notes?: string | null
          ride_type?: string
          shift_type?: string | null
          updated_at?: string
          user_id?: string
          work_address?: string | null
          work_lat?: number | null
          work_lng?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "passengers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
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
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      status_logs: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          latitude: number | null
          log_type: Database["public"]["Enums"]["status_log_type"]
          longitude: number | null
          message: string
          metadata: Json | null
          trip_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          latitude?: number | null
          log_type: Database["public"]["Enums"]["status_log_type"]
          longitude?: number | null
          message: string
          metadata?: Json | null
          trip_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          latitude?: number | null
          log_type?: Database["public"]["Enums"]["status_log_type"]
          longitude?: number | null
          message?: string
          metadata?: Json | null
          trip_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_logs_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_passengers: {
        Row: {
          created_at: string
          dropoff_address: string | null
          dropoff_lat: number | null
          dropoff_lng: number | null
          dropoff_time: string | null
          id: string
          passenger_id: string
          pickup_address: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          pickup_time: string | null
          seat_number: number | null
          status: Database["public"]["Enums"]["passenger_trip_status"]
          trip_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dropoff_address?: string | null
          dropoff_lat?: number | null
          dropoff_lng?: number | null
          dropoff_time?: string | null
          id?: string
          passenger_id: string
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_time?: string | null
          seat_number?: number | null
          status?: Database["public"]["Enums"]["passenger_trip_status"]
          trip_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dropoff_address?: string | null
          dropoff_lat?: number | null
          dropoff_lng?: number | null
          dropoff_time?: string | null
          id?: string
          passenger_id?: string
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_time?: string | null
          seat_number?: number | null
          status?: Database["public"]["Enums"]["passenger_trip_status"]
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_passengers_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "passengers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_passengers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          created_at: string
          destination_address: string
          destination_lat: number | null
          destination_lng: number | null
          driver_id: string | null
          id: string
          notes: string | null
          origin_address: string
          origin_lat: number | null
          origin_lng: number | null
          pickup_time: string
          pickup_time_window_minutes: number | null
          scheduled_date: string
          status: Database["public"]["Enums"]["trip_status"]
          trip_type: Database["public"]["Enums"]["trip_type"]
          updated_at: string
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          destination_address: string
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          origin_address: string
          origin_lat?: number | null
          origin_lng?: number | null
          pickup_time: string
          pickup_time_window_minutes?: number | null
          scheduled_date: string
          status?: Database["public"]["Enums"]["trip_status"]
          trip_type: Database["public"]["Enums"]["trip_type"]
          updated_at?: string
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          created_at?: string
          destination_address?: string
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id?: string | null
          id?: string
          notes?: string | null
          origin_address?: string
          origin_lat?: number | null
          origin_lng?: number | null
          pickup_time?: string
          pickup_time_window_minutes?: number | null
          scheduled_date?: string
          status?: Database["public"]["Enums"]["trip_status"]
          trip_type?: Database["public"]["Enums"]["trip_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
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
      get_driver_id: { Args: { _user_id: string }; Returns: string }
      get_passenger_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "driver" | "passenger"
      passenger_trip_status:
        | "confirmed"
        | "picked_up"
        | "dropped_off"
        | "no_show"
        | "cancelled"
      status_log_type:
        | "trip_status"
        | "passenger_status"
        | "driver_location"
        | "sos_alert"
        | "notification"
      trip_status:
        | "scheduled"
        | "driver_assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      trip_type: "inbound" | "outbound"
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
      app_role: ["admin", "driver", "passenger"],
      passenger_trip_status: [
        "confirmed",
        "picked_up",
        "dropped_off",
        "no_show",
        "cancelled",
      ],
      status_log_type: [
        "trip_status",
        "passenger_status",
        "driver_location",
        "sos_alert",
        "notification",
      ],
      trip_status: [
        "scheduled",
        "driver_assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      trip_type: ["inbound", "outbound"],
    },
  },
} as const
