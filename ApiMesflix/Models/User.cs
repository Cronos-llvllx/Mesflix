using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore; // Necesario para [Index]

namespace ApiMesflix.Models
{
    [Table("Users")]
    [Index(nameof(Email), IsUnique = true)] // Asegura que el Email sea único a nivel de BD
    public class User
    {
        [Key]
        [Column("UserId")]
        public int UserId { get; set; }


        [Required]
        [MaxLength(255)]
        [Column("Email")]
        public  required string Email { get; set; }

        [Required]
        [Column("PasswordHash")]
        public required string PasswordHash { get; set; }

        [Required]
        [MaxLength(100)] // Define una longitud máxima apropiada
        [Column("FirstName")]
        public required string FirstName { get; set; }

        [Required]
        [MaxLength(100)] // Define una longitud máxima apropiada
        [Column("LastName")]
        public required string LastName { get; set; }

        [Required]
        [Column("DateOfBirth")]
        public DateTime DateOfBirth { get; set; } // DateTime es el tipo apropiado aquí

        [Required]
        [Column("DateCreated")]
        public DateTime DateCreated { get; set; }

        // Propiedad de navegación para la relación con UserFavorites
        public virtual ICollection<UserFavorite> UserFavorites { get; set; } = new List<UserFavorite>();
    }
}
