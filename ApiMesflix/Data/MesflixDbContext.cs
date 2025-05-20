using Microsoft.EntityFrameworkCore;
using ApiMesflix.Models;

namespace ApiMesflix.Data;
public class MesflixDbContext : DbContext
{
    public MesflixDbContext(DbContextOptions<MesflixDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Si tus nombres de tabla en T-SQL son exactamente "Users" y "UserFavorites"
        // y las propiedades de navegación están bien definidas, EF Core
        // a menudo puede inferir las relaciones sin configuración explícita aquí
        // cuando se mapea a una BD existente.

        // No obstante, puedes ser explícito para asegurar las relaciones y nombres:
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users"); // Mapea a la tabla Users
            entity.HasKey(e => e.UserId); // Clave primaria
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<UserFavorite>(entity =>
        {
            entity.ToTable("UserFavorites"); // Mapea a la tabla UserFavorites
            entity.HasKey(e => e.UserFavoriteId); // Clave primaria
            entity.HasIndex(e => new { e.UserId, e.MovieId }).IsUnique(); // Índice único combinado

            // Configura la relación con User
            entity.HasOne(d => d.User)
                  .WithMany(p => p.UserFavorites)
                  .HasForeignKey(d => d.UserId)
                  .OnDelete(DeleteBehavior.Cascade) // Coincide con tu T-SQL
                  .HasConstraintName("FK_UserFavorites_Users"); // Opcional: nombrar la FK si existe en la BD
        });
    }
}
