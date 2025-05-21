using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    public class AddFavoriteDto
    {
        [Required]
        public string MovieId { get; set; } = null!;
    }
}
