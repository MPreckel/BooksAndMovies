export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  genre_ids: number[];
  video: boolean;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  budget: number;
  revenue: number;
  tagline: string;
  status: string;
}

export interface Genre {
  id: number;
  name: string;
}
