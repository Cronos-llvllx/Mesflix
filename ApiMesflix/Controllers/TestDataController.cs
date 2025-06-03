using Microsoft.AspNetCore.Authorization; // Necesario para [Authorize]
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Necesario para ClaimTypes
using Microsoft.AspNetCore.Http; // Necesario para StatusCodes

namespace ApiMesflix.Controllers
{
    /// <summary>
    /// Controlador de prueba para verificar endpoints públicos y protegidos por JWT.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TestDataController : ControllerBase
    {
        /// <summary>
        /// Endpoint protegido que requiere un token JWT válido para ser accedido.
        /// Devuelve un mensaje de éxito junto con información extraída del token del usuario autenticado.
        /// </summary>
        /// <returns>Un objeto JSON con un mensaje y los datos del usuario autenticado.</returns>
        /// <response code="200">Acceso concedido. Devuelve datos del usuario.</response>
        /// <response code="401">No autorizado si no se proporciona un token JWT válido.</response>
        [HttpGet("protected")]
        [Authorize] // ¡Este es el atributo clave!
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        public IActionResult GetProtectedData()
        {
            // Gracias a [Authorize] y UseAuthentication, HttpContext.User está poblado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Obtener el UserId del token
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;     // Obtener el Email del token
            var firstName = User.FindFirst(ClaimTypes.GivenName)?.Value; // Obtener el FirstName del token
            var lastName = User.FindFirst(ClaimTypes.Surname)?.Value;   // Obtener el LastName del token

            // Considera validar si los claims existen, aunque [Authorize] ya valida el token.
            // Si un claim específico fuera opcional en el token, el ?.Value maneja el null.

            return Ok(new {
                message = "¡Acceso concedido a datos protegidos!",
                authenticatedUserId = userId,
                authenticatedUserEmail = userEmail,
                authenticatedUserFirstName = firstName, // Añadido para devolver
                authenticatedUserLastName = lastName    // Añadido para devolver
            });
        }

        /// <summary>
        /// Endpoint público que puede ser accedido sin autenticación.
        /// </summary>
        /// <returns>Un objeto JSON con un mensaje público.</returns>
        /// <response code="200">Devuelve un mensaje público.</response>
        [HttpGet("public")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public IActionResult GetPublicData()
        {
            return Ok(new { message = "Estos son datos públicos, cualquiera puede acceder." });
        }
    }
}