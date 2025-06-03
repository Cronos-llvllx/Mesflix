using System.ComponentModel.DataAnnotations;

namespace ApiMesflix.Dtos
{
    /// <summary>
    /// DTO para registrar un nuevo usuario.
    /// Contiene la información necesaria para crear una nueva cuenta de usuario.
    /// </summary>
    public class UserRegisterDto
    {
        /// <summary>
        /// Dirección de correo electrónico del usuario. Debe ser única en el sistema.
        /// Este campo es obligatorio.
        /// </summary>
        /// <example>usuario@ejemplo.com</example>
        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public required string Email { get; set; }

        /// <summary>
        /// Contraseña para la nueva cuenta.
        /// Debe tener un mínimo de 6 caracteres. Este campo es obligatorio.
        /// </summary>
        /// <example>P@$$wOrd123</example>
        [Required]
        [MinLength(6)]
        public required string Password { get; set; }

        /// <summary>
        /// Nombre(s) del usuario.
        /// Este campo es obligatorio.
        /// </summary>
        /// <example>Juan Alberto</example>
        [Required]
        [MaxLength(100)]
        public required string FirstName { get; set; }

        /// <summary>
        /// Apellido(s) del usuario.
        /// Este campo es obligatorio.
        /// </summary>
        /// <example>Pérez García</example>
        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }

        /// <summary>
        /// Fecha de nacimiento del usuario.
        /// Este campo es obligatorio. Se espera en formato YYYY-MM-DD.
        /// </summary>
        /// <example>1990-01-15</example>
        [Required]
        public required string DateOfBirth { get; set; }
    }
}