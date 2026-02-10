export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          display_name: string
          job_title: string | null
          team: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name: string
          job_title?: string | null
          team?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          job_title?: string | null
          team?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string | null
          source_type: 'file_upload' | 'manual_entry' | 'survey'
          file_type: string | null
          file_url: string | null
          uploaded_by: string
          uploaded_at: string
          updated_at: string
          metadata: Json
          search_vector: unknown | null
          status: 'processing' | 'complete' | 'failed'
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          source_type: 'file_upload' | 'manual_entry' | 'survey'
          file_type?: string | null
          file_url?: string | null
          uploaded_by: string
          uploaded_at?: string
          updated_at?: string
          metadata?: Json
          search_vector?: unknown | null
          status?: 'processing' | 'complete' | 'failed'
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          source_type?: 'file_upload' | 'manual_entry' | 'survey'
          file_type?: string | null
          file_url?: string | null
          uploaded_by?: string
          uploaded_at?: string
          updated_at?: string
          metadata?: Json
          search_vector?: unknown | null
          status?: 'processing' | 'complete' | 'failed'
        }
      }
      document_tags: {
        Row: {
          document_id: string
          tag: string
          created_at: string
        }
        Insert: {
          document_id: string
          tag: string
          created_at?: string
        }
        Update: {
          document_id?: string
          tag?: string
          created_at?: string
        }
      }
      surveys: {
        Row: {
          id: string
          title: string
          questions: Json
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          questions: Json
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          questions?: Json
          created_by?: string
          created_at?: string
        }
      }
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentTag = Database['public']['Tables']['document_tags']['Row']
export type Survey = Database['public']['Tables']['surveys']['Row']

export type DocumentWithUser = Document & {
  users: User | null
}

export type DocumentWithTags = Document & {
  document_tags: { tag: string }[]
  users: User | null
}
