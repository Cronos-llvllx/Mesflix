using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Para métodos async de EF Core como AnyAsync, FirstOrDefaultAsync
using System.Threading.Tasks;      // Para usar async Task
using System; // Para DateTime y parsing
using Microsoft.AspNetCore.Http; // Para StatusCodes

using ApiMesflix.Data;           // Donde está MesflixDbContext
using ApiMesflix.Models;           // Donde está clase User
using ApiMesflix.Dtos;           // Donde están UserRegisterDto, UserLoginDto, UserResponseDto

// Usings para JWT
using System.IdentityModel.Tokens.Jwt; // Para JwtSecurityTokenHandler
using System.Security.Claims;        // Para Claims
using System.Text;                   // Para Encoding
using Microsoft.IdentityModel.Tokens;  // Para SymmetricSecurityKey, SigningCredentials
using Microsoft.Extensions.Configuration; // Para IConfiguration

/// <summary>
/// Controlador para manejar la autenticación de usuarios, incluyendo registro y login.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly MesflixDbContext _context;
    private readonly IConfiguration _configuration; // Para leer appsettings.json

    /// <summary>
    /// Constructor para AuthController.
    /// </summary>
    /// <param name="context">Contexto de la base de datos MesflixDbContext.</param>
    /// <param name="configuration">Configuración de la aplicación para acceder a appsettings.json (ej. para JWT).</param>
    public AuthController(MesflixDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Registra un nuevo usuario en el sistema.
    /// </summary>
    /// <param name="userRegisterDto">DTO que contiene la información del usuario a registrar.</param>
    /// <response code="201">Usuario registrado exitosamente. Devuelve información del usuario creado.</response>
    /// <response code="400">Si los datos de entrada son inválidos (ej. email ya en uso, formato de fecha incorrecto, o validaciones del DTO fallan).</response>
    /// <remarks>
    /// Ejemplo de payload:
    ///
    ///     POST /api/auth/register
    ///     {
    ///        "firstName": "Juan",
    ///        "lastName": "Perez",
    ///        "email": "juan.perez@example.com",
    ///        "password": "Password123!",
    ///        "dateOfBirth": "1990-01-15"
    ///     }
    ///
    /// </remarks>
    [HttpPost("register")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
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

        var userResponse = new UserResponseDto
        {
            UserId = newUser.UserId,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            Email = newUser.Email,
            Token = "" // No se genera token en el registro directamente
        };
        
        return CreatedAtAction(nameof(Login), new { email = newUser.Email }, userResponse);
    }

    /// <summary>
    /// Inicia sesión para un usuario existente y devuelve un token JWT.
    /// </summary>
    /// <param name="userLoginDto">DTO que contiene el email y la contraseña del usuario.</param>
    /// <response code="200">Login exitoso. Devuelve información del usuario y el token JWT.</response>
    /// <response code="400">Si los datos de entrada son inválidos (validaciones del DTO fallan).</response>
    /// <response code="401">Si las credenciales (email o contraseña) son incorrectas.</response>
    /// <response code="500">Si la clave JWT no está configurada en el servidor.</response>
    /// <remarks>
    /// Ejemplo de payload:
    ///
    ///     POST /api/auth/login
    ///     {
    ///        "email": "juan.perez@example.com",
    ///        "password": "Password123!"
    ///     }
    ///
    /// </remarks>
    [HttpPost("login")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userLoginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        // ----- INICIO DE GENERACIÓN DE TOKEN JWT -----
        var tokenHandler = new JwtSecurityTokenHandler();
        var keyString = _configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(keyString))
        {
            // Loguear este error críticio en un sistema de logging real
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "La clave JWT no está configurada en el servidor." });
        }
        var key = Encoding.ASCII.GetBytes(keyString!); // Usamos ! porque ya verificamos que no es nulo

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.GivenName, user.FirstName ?? ""), // Usar ?? "" por si FirstName fuera null (aunque es [Required])
                new Claim(ClaimTypes.Surname, user.LastName ?? ""),   // Usar ?? "" por si LastName fuera null (aunque es [Required])
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1), // Tiempo de expiración del token
            Issuer = _configuration["Jwt:Issuer"]!,     // Usamos ! porque esperamos que estén en config
            Audience = _configuration["Jwt:Audience"]!, // Usamos ! porque esperamos que estén en config
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        // ----- FIN DE GENERACIÓN DE TOKEN JWT -----

        var userResponse = new UserResponseDto
        {
            UserId = user.UserId,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Token = tokenString
        };

        return Ok(userResponse);
    }
}