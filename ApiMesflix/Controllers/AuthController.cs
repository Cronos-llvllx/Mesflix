using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Para ToListAsync, FirstOrDefaultAsync, etc.
using ApiMesflix.Data;
using ApiMesflix.Models;
using ApiMesflix.Dtos;
using System.Threading.Tasks; // Para async/await

[Route("api/[controller]")] // Ruta base: /api/auth
[ApiController]
public class AuthController : ControllerBase
{
  private readonly MesflixDbContext _context;

  public AuthController(MesflixDbContext context)
  {
    _context = context;
  }
}
