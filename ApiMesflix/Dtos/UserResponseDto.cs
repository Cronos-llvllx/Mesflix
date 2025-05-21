namespace ApiMesflix.Dtos
{
  public class UserResponseDto
  {
    public int UserId { get; set; }
    public required string FirstName { get; set; } // el alias del perfilk
    public required string LastName { get; set; }
    public required string Email { get; set; } //email usado para loguearse
    public required string Token { get; set; }
  }
}
