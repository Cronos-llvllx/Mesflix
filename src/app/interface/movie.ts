import { Genre } from './genre'; // Si vas a guardar el array de objetos Genre

export interface Movie {
  id: string; // O number, pero sé consistente con cómo lo usas
  title: string;
  description: string; // Mapeado desde 'overview'
  releaseDate?: string; // Mapeado desde 'release_date'
  posterPath?: string | null; // URL completa
  backdropPath?: string | null; // URL completa
  voteAverage?: number; // Mapeado desde 'vote_average'
  genreIds?: number[]; // Para listas de películas
  genres?: Genre[]; // Para detalles de películas (el objeto completo de géneros)
  runtime?: number; // Ejemplo de campo de detalles
  isNew?: boolean;
}
