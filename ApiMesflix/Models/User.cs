using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace ApiMesflix.Models
{
    [Table("Users")] // Asegura que EF Core mapee a la tabla "Users"
    public class User
    {
        [Key]
        [Column("UserId")]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("Username")]
        public string Username { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("Email")]
        public string Email { get; set; }

        [Required]
        [Column("PasswordHash")]
        public string PasswordHash { get; set; }

        [Required]
        [Column("DateCreated")]
        public DateTime DateCreated { get; set; }

        // Propiedad de navegación para la relación con UserFavorites
        public virtual ICollection<UserFavorite> UserFavorites { get; set; } = new List<UserFavorite>();
    }
}
