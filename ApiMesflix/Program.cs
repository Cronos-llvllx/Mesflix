using Microsoft.AspNetCore.Authentication.JwtBearer; // Necesario para AddJwtBearer
using Microsoft.IdentityModel.Tokens;               // Necesario para TokenValidationParameters, SymmetricSecurityKey
using System.Text;                                  // Necesario para Encoding
using ApiMesflix.Data;                              // Namespace de tu DbContext
using Microsoft.EntityFrameworkCore;                // Para AddDbContext

var builder = WebApplication.CreateBuilder(args);

// --- Añade el servicio CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200") // La URL de tu app Angular
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// --- Conexión a la Base de Datos ---
var connectionString = builder.Configuration.GetConnectionString("MesflixDbConnection");
builder.Services.AddDbContext<MesflixDbContext>(options =>
    options.UseSqlServer(connectionString));

// --- INICIO DE CONFIGURACIÓN DE AUTENTICACIÓN JWT ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, // Validar el emisor (iss)
        ValidateAudience = true, // Validar la audiencia (aud)
        ValidateLifetime = true, // Validar la expiración del token (exp)
        ValidateIssuerSigningKey = true, // Validar la firma del token usando la clave secreta

        ValidIssuer = builder.Configuration["Jwt:Issuer"], // El emisor esperado (de appsettings.json)
        ValidAudience = builder.Configuration["Jwt:Audience"], // La audiencia esperada (de appsettings.json)
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)) // La clave secreta
    };
});
// --- FIN DE CONFIGURACIÓN DE AUTENTICACIÓN JWT ---

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // Considera añadir configuración de Swagger para JWT si usas Swagger

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins); // Habilitar CORS

// --- INICIO DE USO DE AUTENTICACIÓN Y AUTORIZACIÓN ---
app.UseAuthentication(); // PRIMERO: Verifica si hay un token y lo valida, estableciendo la identidad del usuario.
app.UseAuthorization();  // SEGUNDO: Verifica si el usuario autenticado tiene permiso para acceder al recurso.
// --- FIN DE USO DE AUTENTICACIÓN Y AUTORIZACIÓN ---

app.MapControllers();

app.Run();
