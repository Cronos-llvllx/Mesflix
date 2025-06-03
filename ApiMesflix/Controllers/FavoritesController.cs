using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic; // Para List<T>
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ApiMesflix.Data;
using ApiMesflix.Dtos;
using ApiMesflix.Models;
using Microsoft.AspNetCore.Http; // Para StatusCodes

/// <summary>
/// Controlador para gestionar las películas favoritas de los usuarios.
/// Todos los endpoints requieren autenticación.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize] // Protege todos los endpoints de este controlador
public class FavoritesController : ControllerBase
{
    private readonly MesflixDbContext _context;
    // Considera inyectar ILogger si quieres loguear las excepciones 'ex' en los catch blocks
    // private readonly ILogger<FavoritesController> _logger;

    /// <summary>
    /// Constructor para FavoritesController.
    /// </summary>
    /// <param name="context">Contexto de la base de datos MesflixDbContext.</param>
    public FavoritesController(MesflixDbContext context /*, ILogger<FavoritesController> logger */)
    {
        _context = context;
        // _logger = logger;
    }

    /// <summary>
    /// Obtiene el ID del usuario autenticado a partir del token JWT.
    /// </summary>
    /// <returns>El ID del usuario.</returns>
    /// <exception cref="InvalidOperationException">Si el ID del usuario no se encuentra en el token o es inválido.</exception>
    private int GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        throw new InvalidOperationException("User ID not found in token or is invalid.");
    }

    /// <summary>
    /// Obtiene la lista de IDs de películas favoritas para el usuario autenticado.
    /// </summary>
    /// <returns>Una lista de strings, donde cada string es un MovieId.</returns>
    /// <response code="200">Devuelve la lista de MovieIds favoritos.</response>
    /// <response code="401">No autorizado si el token es inválido o el UserId no se puede obtener del token.</response>
    /// <response code="500">Si ocurre un error interno en el servidor.</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<string>>> GetUserFavorites()
    {
        try
        {
            int userId = GetAuthenticatedUserId();

            var favoriteMovieIds = await _context.UserFavorites
                                            .Where(uf => uf.UserId == userId)
                                            .Select(uf => uf.MovieId)
                                            .ToListAsync();
            return Ok(favoriteMovieIds);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // _logger?.LogError(ex, "Error al obtener los favoritos del usuario."); // Ejemplo de logueo
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al obtener los favoritos." });
        }
    }

    /// <summary>
    /// Añade una película a la lista de favoritos del usuario autenticado.
    /// </summary>
    /// <param name="addFavoriteDto">DTO que contiene el MovieId de la película a añadir.</param>
    /// <returns>Un mensaje de confirmación y el MovieId añadido.</returns>
    /// <response code="201">Película añadida a favoritos exitosamente.</response>
    /// <response code="200">Si la película ya estaba en favoritos (no se añade de nuevo, pero se considera exitoso).</response>
    /// <response code="400">Si los datos de entrada son inválidos.</response>
    /// <response code="401">No autorizado si el token es inválido o el UserId no se puede obtener del token.</response>
    /// <response code="500">Si ocurre un error interno en el servidor.</response>
    /// <remarks>
    /// Ejemplo de payload:
    ///
    ///     POST /api/favorites
    ///     {
    ///        "movieId": "299536"
    ///     }
    ///
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteDto addFavoriteDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            int userId = GetAuthenticatedUserId();
            var movieId = addFavoriteDto.MovieId;

            bool alreadyExists = await _context.UserFavorites
                                            .AnyAsync(uf => uf.UserId == userId && uf.MovieId == movieId);

            if (alreadyExists)
            {
                return Ok(new { message = "Esta película ya está en tus favoritos.", movieId });
            }

            var userFavorite = new UserFavorite
            {
                UserId = userId,
                MovieId = movieId,
                DateAdded = DateTime.UtcNow
                // La propiedad User no se necesita asignar aquí si UserFavorite.User es nullable (User?)
                // EF Core manejará la relación a través de UserId.
            };

            _context.UserFavorites.Add(userFavorite);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserFavorites), new { /* Sin parámetros de ruta para GetUserFavorites */ },
                                    new { message = "Película añadida a favoritos.", movieId = userFavorite.MovieId });
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // _logger?.LogError(ex, "Error al añadir el favorito."); // Ejemplo de logueo
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al añadir el favorito." });
        }
    }

    /// <summary>
    /// Elimina una película de la lista de favoritos del usuario autenticado.
    /// </summary>
    /// <param name="movieId">El ID de la película a eliminar de favoritos.</param>
    /// <returns>Un mensaje de confirmación.</returns>
    /// <response code="200">Película eliminada de favoritos exitosamente.</response>
    /// <response code="204">Película eliminada de favoritos exitosamente (alternativa a 200 con mensaje).</response>
    /// <response code="400">Si el MovieId no se proporciona.</response>
    /// <response code="401">No autorizado si el token es inválido o el UserId no se puede obtener del token.</response>
    /// <response code="404">Si la película no se encuentra en los favoritos del usuario.</response>
    /// <response code="500">Si ocurre un error interno en el servidor.</response>
    [HttpDelete("{movieId}")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RemoveFavorite(string movieId)
    {
        if (string.IsNullOrEmpty(movieId))
        {
            return BadRequest(new { message = "El ID de la película es requerido." });
        }

        try
        {
            int userId = GetAuthenticatedUserId();

            var userFavorite = await _context.UserFavorites
                                            .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.MovieId == movieId);

            if (userFavorite == null)
            {
                return NotFound(new { message = "La película no se encontró en tus favoritos." });
            }

            _context.UserFavorites.Remove(userFavorite);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Película eliminada de favoritos." });
            // Alternativamente, para un DELETE exitoso sin contenido que devolver:
            // return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // _logger?.LogError(ex, "Error al eliminar el favorito."); // Ejemplo de logueo
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Error al eliminar el favorito." });
        }
    }
}