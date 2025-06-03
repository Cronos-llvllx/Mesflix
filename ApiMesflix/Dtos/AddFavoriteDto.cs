using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    /// <summary>
    /// DTO para añadir una película a los favoritos de un usuario.
    /// </summary>
    public class AddFavoriteDto
    {
        /// <summary>
        /// El identificador de la película (ej. de TMDB) que se va a añadir a favoritos.
        /// </summary>
        /// <example>299536</example>
        [Required]
        public string MovieId { get; set; } = null!;
    }
}