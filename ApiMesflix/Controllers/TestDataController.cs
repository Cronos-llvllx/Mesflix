using Microsoft.AspNetCore.Authorization; // Necesario para [Authorize]
using Microsoft.AspNetCore.Mvc;
using System.Linq; // Para User.Claims
using System.Security.Claims;

namespace ApiMesflix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestDataController : ControllerBase
    {
        // Este endpoint solo será accesible si se envía un token JWT válido
        [HttpGet("protected")]
        [Authorize] // ¡Este es el atributo clave!
        public IActionResult GetProtectedData()
        {
            // Gracias a [Authorize] y UseAuthentication, HttpContext.User está poblado
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Obtener el UserId del token
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;     // Obtener el Email del token
            // ... y así con otros claims que hayas puesto en el token

            return Ok(new {
                message = "¡Acceso concedido a datos protegidos!",
                authenticatedUserId = userId,
                authenticatedUserEmail = userEmail
            });
        }

        [HttpGet("public")]
        public IActionResult GetPublicData()
        {
            return Ok(new { message = "Estos son datos públicos, cualquiera puede acceder." });
        }
    }
}
