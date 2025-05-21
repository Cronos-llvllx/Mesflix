using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiMesflix.Models
{
    [Table("UserFavorites")]
    public class UserFavorite
    {
        [Key]
        [Column("UserFavoriteId")]
        public int UserFavoriteId { get; set; } // Coincide con INT IDENTITY

        [Required]
        [Column("UserId")]
        public int UserId { get; set; } // Clave Foránea

        [Required]
        [MaxLength(255)]
        [Column("MovieId")]
        public required string MovieId { get; set; } // Coincide con NVARCHAR(255)

        [Required]
        [Column("DateAdded")]
        public DateTime DateAdded { get; set; } // Coincide con DATETIME2

        // Propiedad de navegación hacia User
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
}
