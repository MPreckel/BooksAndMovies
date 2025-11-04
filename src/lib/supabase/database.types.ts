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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      movies_watched: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path: string | null
          description: string | null
          watched_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path?: string | null
          description?: string | null
          watched_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          title?: string
          poster_path?: string | null
          description?: string | null
          watched_date?: string
          created_at?: string
        }
      }
      movies_to_watch: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path: string | null
          description: string | null
          added_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path?: string | null
          description?: string | null
          added_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          title?: string
          poster_path?: string | null
          description?: string | null
          added_date?: string
          created_at?: string
        }
      }
      movie_reviews: {
        Row: {
          id: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path: string | null
          rating: number | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tmdb_id: number
          title: string
          poster_path?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tmdb_id?: number
          title?: string
          poster_path?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books_read: {
        Row: {
          id: string
          user_id: string
          google_books_id: string
          title: string
          authors: string[] | null
          thumbnail: string | null
          description: string | null
          finished_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          google_books_id: string
          title: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          finished_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          google_books_id?: string
          title?: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          finished_date?: string
          created_at?: string
        }
      }
      books_reading: {
        Row: {
          id: string
          user_id: string
          google_books_id: string
          title: string
          authors: string[] | null
          thumbnail: string | null
          description: string | null
          started_date: string
          current_page: number | null
          total_pages: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          google_books_id: string
          title: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          started_date?: string
          current_page?: number | null
          total_pages?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          google_books_id?: string
          title?: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          started_date?: string
          current_page?: number | null
          total_pages?: number | null
          created_at?: string
        }
      }
      books_to_read: {
        Row: {
          id: string
          user_id: string
          google_books_id: string
          title: string
          authors: string[] | null
          thumbnail: string | null
          description: string | null
          added_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          google_books_id: string
          title: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          added_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          google_books_id?: string
          title?: string
          authors?: string[] | null
          thumbnail?: string | null
          description?: string | null
          added_date?: string
          created_at?: string
        }
      }
      book_reviews: {
        Row: {
          id: string
          user_id: string
          google_books_id: string
          title: string
          authors: string[] | null
          thumbnail: string | null
          rating: number | null
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          google_books_id: string
          title: string
          authors?: string[] | null
          thumbnail?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          google_books_id?: string
          title?: string
          authors?: string[] | null
          thumbnail?: string | null
          rating?: number | null
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
