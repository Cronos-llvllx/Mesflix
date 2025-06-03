using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    /// <summary>
    /// DTO para el inicio de sesión de un usuario.
    /// Contiene las credenciales necesarias para la autenticación.
    /// </summary>
    public class UserLoginDto
    {
        /// <summary>
        /// Dirección de correo electrónico del usuario para iniciar sesión.
        /// Este campo es obligatorio.
        /// </summary>
        /// <example>usuario@ejemplo.com</example>
        [Required]
        [EmailAddress] // Es buena práctica añadir esta validación también
        public required string Email { get; set; }

        /// <summary>
        /// Contraseña del usuario para iniciar sesión.
        /// Este campo es obligatorio.
        /// </summary>
        /// <example>P@$$wOrd123</example>
        [Required]
        public required string Password { get; set; }
    }
}