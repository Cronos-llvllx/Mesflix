export interface Movie {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  isNew?: boolean; // Flag opcional para la película más reciente
}
