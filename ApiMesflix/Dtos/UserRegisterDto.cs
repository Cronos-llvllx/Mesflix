using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    public class UserRegisterDto
{
  [Required]
  [MaxLength(100)]
  public string Username { get; set; }

  [Required]
  [EmailAddress]
  [MaxLength(255)]
  public string Email { get; set; }

  [Required]
  [MinLength(6)] // Ejemplo de validación de contraseña
  public string Password { get; set; }
}

}
