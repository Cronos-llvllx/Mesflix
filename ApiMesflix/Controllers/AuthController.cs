using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Para métodos async de EF Core como AnyAsync, FirstOrDefaultAsync
using System.Threading.Tasks;      // Para usar async Task

using ApiMesflix.Data;         // Donde está MesflixDbContext
using ApiMesflix.Models;       // Donde está clase User
using ApiMesflix.Dtos;         // Donde están UserRegisterDto, UserLoginDto, UserResponseDto

[Route("api/[controller]")] // Define la ruta base para este controlador: /api/auth
[ApiController]             // Indica que es un controlador de API y habilita características útiles
public class AuthController : ControllerBase
{
    private readonly MesflixDbContext _context; // Para interactuar con la base de datos

    // Inyección de dependencias: EF Core DbContext
    public AuthController(MesflixDbContext context)
    {
        _context = context;
    }

    // Endpoint para Registrar un nuevo usuario
    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
    {
        // Verifica si los datos recibidos cumplen con las validaciones del DTO (ej. [Required])
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Devuelve errores de validación
        }

        // Verificar si el nombre de usuario ya existe
        if (await _context.Users.AnyAsync(u => u.Username == userRegisterDto.Username))
        {
            return BadRequest(new { message = "El nombre de usuario ya está en uso." });
        }

        // Verificar si el email ya existe
        if (await _context.Users.AnyAsync(u => u.Email == userRegisterDto.Email))
        {
            return BadRequest(new { message = "El email ya está en uso." });
        }

        // Hashear la contraseña usando BCrypt.Net-Next
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);

        // Crear una nueva instancia de la entidad User
        var newUser = new User
        {
            Username = userRegisterDto.Username,
            Email = userRegisterDto.Email,
            PasswordHash = passwordHash,
            DateCreated = System.DateTime.UtcNow // O si tu BD lo pone por defecto, no es necesario aquí
        };

        // Añadir el nuevo usuario al DbContext y guardar cambios en la BD
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        // Devolver una respuesta exitosa
        // Podrías devolver el usuario creado (sin el hash) o un UserResponseDto
        return Ok(new { message = "Usuario registrado exitosamente!", userId = newUser.UserId });
    }

    // Endpoint para Iniciar Sesión
    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto userLoginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Buscar al usuario por su identificador (podría ser Username o Email)
        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Username == userLoginDto.LoginIdentifier || u.Email == userLoginDto.LoginIdentifier);

        // Si el usuario no se encuentra O si la contraseña es incorrecta (verificación con BCrypt)
        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        {
            // Es importante dar un mensaje genérico para no revelar si el usuario existe o no
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        // Login exitoso
        // En una aplicación real, aquí generarías un JWT (JSON Web Token)
        // y lo devolverías al cliente para autenticar peticiones futuras.

        var userResponse = new UserResponseDto // Usando el DTO de respuesta
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Token = "simulated.jwt.token.for." + user.Username // Placeholder para el token JWT
        };

        return Ok(userResponse);
    }
}
