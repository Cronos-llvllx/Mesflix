using System.ComponentModel.DataAnnotations;


namespace ApiMesflix.Dtos
{
  public class UserLoginDto
{
    [Required]
    // El usuario debe loguearse con Email
    public required string Email { get; set; }

    [Required]
    public required string Password { get; set; }
}
}
