
namespace ApiMesflix.Dtos
{
  public class UserResponseDto
  {    public int UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Token { get; set; } // Aquí irá el JWT más adelante
  }
  }
