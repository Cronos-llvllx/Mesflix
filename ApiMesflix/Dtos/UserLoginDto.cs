using System.ComponentModel.DataAnnotations;


namespace ApiMesflix.Dtos
{
  public class UserLoginDto
{
    [Required]
    // El usuario podría loguearse con Username o Email
    public string LoginIdentifier { get; set; } // Podrías tener Username y Email separados

    [Required]
    public string Password { get; set; }
}
}
