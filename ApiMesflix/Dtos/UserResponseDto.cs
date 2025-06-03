namespace ApiMesflix.Dtos
{
    /// <summary>
    /// DTO para la respuesta después de un login o registro exitoso.
    /// Contiene información del usuario y el token de acceso JWT.
    /// </summary>
    public class UserResponseDto
    {
        /// <summary>
        /// Identificador único del usuario.
        /// </summary>
        /// <example>123</example>
        public int UserId { get; set; }

        /// <summary>
        /// Nombre(s) del usuario.
        /// </summary>
        /// <example>Juan Alberto</example>
        public required string FirstName { get; set; }

        /// <summary>
        /// Apellido(s) del usuario.
        /// </summary>
        /// <example>Pérez García</example>
        public required string LastName { get; set; }

        /// <summary>
        /// Dirección de correo electrónico del usuario.
        /// </summary>
        /// <example>juan.perez@example.com</example>
        public required string Email { get; set; }

        /// <summary>
        /// Token JWT de autenticación para el usuario.
        /// Este token debe ser enviado en la cabecera 'Authorization' como 'Bearer [token]' para acceder a endpoints protegidos.
        /// </summary>
        /// <example>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</example>
        public required string Token { get; set; }
    }
}