// src/app/data/simulated-movies.ts
import { Movie } from "../interface/movie";

export const SIMULATED_MOVIES: Movie[] = [
    { id: 'movie1', title: 'Película Increíble 1', description: 'Una descripción breve...', imageUrl: 'BatmanAK.jpg' }, // Quita isNew aquí si no es relevante globalmente
    { id: 'movie2', title: 'Secuela Asombrosa 2', description: 'Las aventuras continúan...', imageUrl: 'GhostRider.jpg' },
    { id: 'movie3', title: 'El Origen Épico 3', description: 'Descubre cómo empezó...', imageUrl: 'Skyfall.jpg' },
    // Añade más películas simuladas si quieres probar con más datos
    { id: 'movie4', title: 'Otra Película 4', description: 'Descripción 4...', imageUrl: 'WinterSoldier.jpg' },
];
