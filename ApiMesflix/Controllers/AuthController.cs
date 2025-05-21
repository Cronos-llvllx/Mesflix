using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Para métodos async de EF Core como AnyAsync, FirstOrDefaultAsync
using System.Threading.Tasks;      // Para usar async Task
using System; // Para DateTime y parsing

using ApiMesflix.Data;           // Donde está MesflixDbContext
using ApiMesflix.Models;           // Donde está clase User
using ApiMesflix.Dtos;           // Donde están UserRegisterDto, UserLoginDto, UserResponseDto

// Usings para JWT
using System.IdentityModel.Tokens.Jwt; // Para JwtSecurityTokenHandler
using System.Security.Claims;        // Para Claims
using System.Text;                   // Para Encoding
using Microsoft.IdentityModel.Tokens;  // Para SymmetricSecurityKey, SigningCredentials
using Microsoft.Extensions.Configuration; // Para IConfiguration

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly MesflixDbContext _context;
    private readonly IConfiguration _configuration; // Para leer appsettings.json

    // Inyección de dependencias: EF Core DbContext y IConfiguration
    public AuthController(MesflixDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration; // Guardar la configuración
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar si el email ya existe
        if (await _context.Users.AnyAsync(u => u.Email == userRegisterDto.Email))
        {
            return BadRequest(new { message = "El email ya está en uso." });
        }

        // Hashear la contraseña
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);

        // Parsear la fecha de nacimiento
        DateTime dateOfBirth;
        if (!DateTime.TryParse(userRegisterDto.DateOfBirth, out dateOfBirth)) // También puedes usar TryParseExact si necesitas un formato específico
        {
            return BadRequest(new { message = "El formato de la fecha de nacimiento no es válido. Use yyyy-MM-dd." });
        }

        var newUser = new User
        {
            FirstName = userRegisterDto.FirstName,
            LastName = userRegisterDto.LastName,
            Email = userRegisterDto.Email,
            DateOfBirth = dateOfBirth,
            PasswordHash = passwordHash,
            DateCreated = DateTime.UtcNow
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Crear una respuesta más completa (asumiendo que UserResponseDto está actualizado)
        var userResponse = new UserResponseDto
        {
            UserId = newUser.UserId,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Email = newUser.Email,
            Token = "" // No se genera token en el registro directamente, el usuario debe hacer login
        };

        // Devuelve 201 Created, con la ubicación para obtener el usuario (o la acción de login) y el objeto creado/respuesta.
        // Para la ubicación, podrías crear un endpoint GetUser(id) o apuntar a Login
        // Aquí apuntaremos a Login y enviaremos el email como identificador de ruta para el siguiente paso si fuera necesario.
        return CreatedAtAction(nameof(Login), new { email = newUser.Email }, userResponse);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto userLoginDto) // UserLoginDto ya tiene Email y Password
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Buscar al usuario por su Email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        // ----- INICIO DE GENERACIÓN DE TOKEN JWT -----
        var tokenHandler = new JwtSecurityTokenHandler();
        // Obtener la clave secreta de appsettings.json (asegúrate de que exista y sea segura)
        var keyString = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(keyString))
        {
            // Considera loguear este error también
            return StatusCode(StatusCodes.Status500InternalServerError, "La clave JWT no está configurada.");
        }
        var key = Encoding.ASCII.GetBytes(keyString);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName ?? ""), // Usar ?? "" si FirstName podría ser null
                new Claim(ClaimTypes.Surname, user.LastName ?? ""),   // Usar ?? "" si LastName podría ser null
                // Puedes añadir más claims, como roles:
                // new Claim(ClaimTypes.Role, "User"), // Ejemplo
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID único del Token
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Tiempo de expiración del token (ej. 1 hora)
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        // ----- FIN DE GENERACIÓN DE TOKEN JWT -----

        var userResponse = new UserResponseDto // Asegúrate que UserResponseDto esté actualizado
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Token = tokenString // El token JWT real
        };

        return Ok(userResponse);
    }
}
