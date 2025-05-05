export interface Genre {
  id: string | number; // Identificador único para el género
  name: string;        // Nombre a mostrar
  cssClass?: string;   // Clases CSS para estilo (forma, tamaño)
  // Podrías añadir más propiedades después, como 'movieCount' para el tamaño dinámico
}
