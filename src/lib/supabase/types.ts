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
      sports_clubs: {
        Row: { id: string; rank: number; club: string; est_value: string | null; yoy: string | null; up: boolean | null; capacity: string | null; founded: number | null; revenue: string | null; wages: string | null; profit: string | null; profitable: boolean | null; margin: string | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; rank: number; club: string; est_value?: string | null; yoy?: string | null; up?: boolean | null; capacity?: string | null; founded?: number | null; revenue?: string | null; wages?: string | null; profit?: string | null; profitable?: boolean | null; margin?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; rank?: number; club?: string; est_value?: string | null; yoy?: string | null; up?: boolean | null; capacity?: string | null; founded?: number | null; revenue?: string | null; wages?: string | null; profit?: string | null; profitable?: boolean | null; margin?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      sports_athletes: {
        Row: { id: string; rank: number; name: string; pos: string | null; club: string | null; market_value: string | null; trend: string | null; up: boolean | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; rank: number; name: string; pos?: string | null; club?: string | null; market_value?: string | null; trend?: string | null; up?: boolean | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; rank?: number; name?: string; pos?: string | null; club?: string | null; market_value?: string | null; trend?: string | null; up?: boolean | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      sports_sponsorships: {
        Row: { id: string; rank: number; party: string; sponsor: string; category: string | null; annual: string | null; total_value: string | null; since_year: number | null; expiry_year: number | null; status: string | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; rank: number; party: string; sponsor: string; category?: string | null; annual?: string | null; total_value?: string | null; since_year?: number | null; expiry_year?: number | null; status?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; rank?: number; party?: string; sponsor?: string; category?: string | null; annual?: string | null; total_value?: string | null; since_year?: number | null; expiry_year?: number | null; status?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      sports_transfers: {
        Row: { id: string; rank: number; player: string; pos: string | null; from_club: string | null; to_club: string | null; fee: string | null; contract: string | null; status: string | null; deal_date: string | null; direction: string | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; rank: number; player: string; pos?: string | null; from_club?: string | null; to_club?: string | null; fee?: string | null; contract?: string | null; status?: string | null; deal_date?: string | null; direction?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; rank?: number; player?: string; pos?: string | null; from_club?: string | null; to_club?: string | null; fee?: string | null; contract?: string | null; status?: string | null; deal_date?: string | null; direction?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      sports_broadcast_deals: {
        Row: { id: string; sort_order: number; comp: string; rights: string | null; value: string | null; per_season: string | null; territory: string | null; expiry: string | null; status: string | null; created_at: string | null; updated_at: string | null }
        Insert: { id?: string; sort_order?: number; comp: string; rights?: string | null; value?: string | null; per_season?: string | null; territory?: string | null; expiry?: string | null; status?: string | null; created_at?: string | null; updated_at?: string | null }
        Update: { id?: string; sort_order?: number; comp?: string; rights?: string | null; value?: string | null; per_season?: string | null; territory?: string | null; expiry?: string | null; status?: string | null; created_at?: string | null; updated_at?: string | null }
        Relationships: []
      }
      alerts: {
        Row: {
          active: boolean | null
          condition: string
          created_at: string | null
          id: string
          last_fired_at: string | null
          macro_id: string | null
          notify_via: string[] | null
          period: string | null
          symbol_id: string | null
          threshold: number
          user_id: string
        }
        Insert: {
          active?: boolean | null
          condition: string
          created_at?: string | null
          id?: string
          last_fired_at?: string | null
          macro_id?: string | null
          notify_via?: string[] | null
          period?: string | null
          symbol_id?: string | null
          threshold: number
          user_id: string
        }
        Update: {
          active?: boolean | null
          condition?: string
          created_at?: string | null
          id?: string
          last_fired_at?: string | null
          macro_id?: string | null
          notify_via?: string[] | null
          period?: string | null
          symbol_id?: string | null
          threshold?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_macro_id_fkey"
            columns: ["macro_id"]
            isOneToOne: false
            referencedRelation: "macro_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      article_macros: {
        Row: {
          article_id: string
          series_id: string
        }
        Insert: {
          article_id: string
          series_id: string
        }
        Update: {
          article_id?: string
          series_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_macros_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_macros_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "macro_series"
            referencedColumns: ["id"]
          },
        ]
      }
      article_symbols: {
        Row: {
          article_id: string
          symbol_id: string
        }
        Insert: {
          article_id: string
          symbol_id: string
        }
        Update: {
          article_id?: string
          symbol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_symbols_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_symbols_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string | null
          body: string
          category_id: string | null
          created_at: string | null
          dek: string | null
          hero_alt: string | null
          hero_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          category_id?: string | null
          created_at?: string | null
          dek?: string | null
          hero_alt?: string | null
          hero_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          created_at?: string | null
          dek?: string | null
          hero_alt?: string | null
          hero_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      business_claims: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          evidence_url: string | null
          id: string
          issuer_id: string
          note: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_at_business: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          issuer_id: string
          note?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_at_business?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          evidence_url?: string | null
          id?: string
          issuer_id?: string
          note?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_at_business?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_claims_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "issuers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          display_order: number | null
          id: string
          label: string
          slug: string
        }
        Insert: {
          description?: string | null
          display_order?: number | null
          id?: string
          label: string
          slug: string
        }
        Update: {
          description?: string | null
          display_order?: number | null
          id?: string
          label?: string
          slug?: string
        }
        Relationships: []
      }
      currencies: {
        Row: {
          code: string
          name: string
          symbol: string | null
        }
        Insert: {
          code: string
          name: string
          symbol?: string | null
        }
        Update: {
          code?: string
          name?: string
          symbol?: string | null
        }
        Relationships: []
      }
      exchanges: {
        Row: {
          country: string
          currency: string
          mic: string
          name: string
          timezone: string
          trading_hours: Json | null
        }
        Insert: {
          country: string
          currency: string
          mic: string
          name: string
          timezone: string
          trading_hours?: Json | null
        }
        Update: {
          country?: string
          currency?: string
          mic?: string
          name?: string
          timezone?: string
          trading_hours?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "exchanges_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      issuers: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          employees: number | null
          founded_year: number | null
          id: string
          logo_url: string | null
          name: string
          sector_id: string | null
          slug: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          employees?: number | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name: string
          sector_id?: string | null
          slug: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          employees?: number | null
          founded_year?: number | null
          id?: string
          logo_url?: string | null
          name?: string
          sector_id?: string | null
          slug?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issuers_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      macro_series: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          frequency: string
          id: string
          label: string
          series_id: string
          source: string
          source_url: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          frequency: string
          id?: string
          label: string
          series_id: string
          source: string
          source_url?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          frequency?: string
          id?: string
          label?: string
          series_id?: string
          source?: string
          source_url?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      macro_values: {
        Row: {
          date: string
          series_id: string
          value: number
        }
        Insert: {
          date: string
          series_id: string
          value: number
        }
        Update: {
          date?: string
          series_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "macro_values_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "macro_series"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes_daily: {
        Row: {
          adj_close: number | null
          close: number | null
          date: string
          high: number | null
          low: number | null
          open: number | null
          symbol_id: string
          volume: number | null
        }
        Insert: {
          adj_close?: number | null
          close?: number | null
          date: string
          high?: number | null
          low?: number | null
          open?: number | null
          symbol_id: string
          volume?: number | null
        }
        Update: {
          adj_close?: number | null
          close?: number | null
          date?: string
          high?: number | null
          low?: number | null
          open?: number | null
          symbol_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_daily_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          message: string
          type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          message: string
          type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          message?: string
          type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          id: string
          label: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          id?: string
          label: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          id?: string
          label?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectors_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      symbols: {
        Row: {
          asset_class: string
          base_currency: string | null
          created_at: string | null
          currency: string | null
          delisted_at: string | null
          figi: string | null
          id: string
          is_active: boolean | null
          isin: string | null
          issuer_id: string | null
          listed_at: string | null
          mic: string | null
          name: string
          quote_currency: string | null
          ticker: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          asset_class: string
          base_currency?: string | null
          created_at?: string | null
          currency?: string | null
          delisted_at?: string | null
          figi?: string | null
          id?: string
          is_active?: boolean | null
          isin?: string | null
          issuer_id?: string | null
          listed_at?: string | null
          mic?: string | null
          name: string
          quote_currency?: string | null
          ticker: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          asset_class?: string
          base_currency?: string | null
          created_at?: string | null
          currency?: string | null
          delisted_at?: string | null
          figi?: string | null
          id?: string
          is_active?: boolean | null
          isin?: string | null
          issuer_id?: string | null
          listed_at?: string | null
          mic?: string | null
          name?: string
          quote_currency?: string | null
          ticker?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "symbols_base_currency_fkey"
            columns: ["base_currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "symbols_currency_fkey"
            columns: ["currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "symbols_issuer_id_fkey"
            columns: ["issuer_id"]
            isOneToOne: false
            referencedRelation: "issuers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symbols_mic_fkey"
            columns: ["mic"]
            isOneToOne: false
            referencedRelation: "exchanges"
            referencedColumns: ["mic"]
          },
          {
            foreignKeyName: "symbols_quote_currency_fkey"
            columns: ["quote_currency"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      watchlist_groups: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlist_items: {
        Row: {
          added_at: string | null
          group_id: string
          id: string
          macro_id: string | null
          symbol_id: string | null
        }
        Insert: {
          added_at?: string | null
          group_id: string
          id?: string
          macro_id?: string | null
          symbol_id?: string | null
        }
        Update: {
          added_at?: string | null
          group_id?: string
          id?: string
          macro_id?: string | null
          symbol_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "watchlist_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_items_macro_id_fkey"
            columns: ["macro_id"]
            isOneToOne: false
            referencedRelation: "macro_series"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_items_symbol_id_fkey"
            columns: ["symbol_id"]
            isOneToOne: false
            referencedRelation: "symbols"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
