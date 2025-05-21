using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    public class UserRegisterDto
    {
      [Required]
      [EmailAddress]
      [MaxLength(255)]
      public required string Email { get; set; }

      [Required]
      [MinLength(6)]
      public required string Password { get; set; }

      [Required]
      [MaxLength(100)] // Ajusta el MaxLength según necesites
      public required string FirstName { get; set; }

      [Required]
      [MaxLength(100)] // Ajusta el MaxLength según necesites
      public required string LastName { get; set; }

      [Required]
      // Podrías añadir validación de tipo de dato si quieres,
      // pero ASP.NET Core intentará enlazarlo a DateTime si tu modelo User lo tiene así.
      public required string DateOfBirth { get; set; } // O DateTime si prefieres parsearlo aquí. String es más simple para recibir de JSON.
    }
}
