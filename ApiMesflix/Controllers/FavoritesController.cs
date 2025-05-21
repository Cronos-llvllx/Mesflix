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

[Route("api/[controller]")]
[ApiController]
[Authorize] //Protege todos los endpoints de este controlador
public class FavoritesController : ControllerBase
{
    private readonly MesflixDbContext _context;

    public FavoritesController(MesflixDbContext context)
    {
        _context = context;
    }

    // Helper para obtener el UserId del usuario autenticado desde el token JWT
    private int GetAuthenticatedUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //  valida si el claim existe y es un entero válido
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        // Considera lanzar una excepción o devolver un error si el UserId no se encuentra o es inválido
        // Para este ejemplo, asumimos que siempre estará presente para un usuario autorizado.
        // En un caso real, manejarías esto más robustamente.
        throw new InvalidOperationException("User ID not found in token or is invalid.");
    }

    // GET: api/favorites
    // Obtiene todos los MovieIds favoritos del usuario autenticado
    [HttpGet]
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
            // Si GetAuthenticatedUserId lanza la excepción porque el UserId no está en el token
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Loguear el error (ex) en un sistema de logging real
            return StatusCode(StatusCodes.Status500InternalServerError, "Error al obtener los favoritos.");
        }
    }

    // POST: api/favorites
    // Añade una película a los favoritos del usuario
    [HttpPost]
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

            // Verificar si la película ya está en los favoritos de este usuario
            bool alreadyExists = await _context.UserFavorites
                                        .AnyAsync(uf => uf.UserId == userId && uf.MovieId == movieId);

            if (alreadyExists)
            {
                // Puedes devolver un 200 OK si consideras que no es un error, o un 409 Conflict
                return Ok(new { message = "Esta película ya está en tus favoritos." });
                // return Conflict(new { message = "Esta película ya está en tus favoritos." });
            }

            var userFavorite = new UserFavorite
            {
                UserId = userId,
                MovieId = movieId,
                DateAdded = DateTime.UtcNow
            };

            _context.UserFavorites.Add(userFavorite);
            await _context.SaveChangesAsync();

            // Podrías devolver el objeto creado o una simple confirmación
            return CreatedAtAction(nameof(GetUserFavorites), new { /* no hay parámetros de ruta para GetUserFavorites */ },
                                  new { message = "Película añadida a favoritos.", movieId = userFavorite.MovieId });
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Loguear el error (ex)
            return StatusCode(StatusCodes.Status500InternalServerError, "Error al añadir el favorito.");
        }
    }

    // DELETE: api/favorites/{movieId}
    // Elimina una película de los favoritos del usuario
    [HttpDelete("{movieId}")]
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

            return Ok(new { message = "Película eliminada de favoritos." }); // O return NoContent(); para 204
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            // Loguear el error (ex)
            return StatusCode(StatusCodes.Status500InternalServerError, "Error al eliminar el favorito.");
        }
    }
}
