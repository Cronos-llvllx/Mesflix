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
builder.Services.AddSwaggerGen(options =>
{
    // Define la información general de tu API para la UI de Swagger
options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
{
    Version = "v1",
    Title = "Mesflix API",
    Description = "API para la aplicación Mesflix"
});

// Configurar Swagger para usar el archivo XML de documentación
var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
if (File.Exists(xmlPath)) // Buena práctica verificar si el archivo existe
{
    options.IncludeXmlComments(xmlPath);
}

// Configurar Swagger para usar JWT Bearer
// 1. Definir el esquema de seguridad "Bearer"
options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
{
    // Dónde se espera el token (en este caso, en la cabecera)
    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
    // Descripción que verá el usuario en la UI de Swagger
    Description = "Por favor, ingresa 'Bearer' [espacio] y luego tu token en el campo de texto de abajo.",
    // Nombre de la cabecera que llevará el token
    Name = "Authorization",
    // Tipo de esquema de seguridad
    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey, // Usar ApiKey es una forma común para Bearer tokens.
                                                              // Alternativamente, podrías usar Http con Scheme = "bearer".
    Scheme = "Bearer" // El esquema a usar (importante para la UI)
});

// 2. Indicar que los endpoints pueden requerir este esquema de seguridad "Bearer"
options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
{
    {
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Reference = new Microsoft.OpenApi.Models.OpenApiReference
            {
                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                Id = "Bearer" // Debe coincidir con el nombre dado en AddSecurityDefinition
            },
            // Scheme = "oauth2", // No es necesario si Type es ApiKey
            // Name = "Bearer",    // No es necesario si Type es ApiKey
            // In = ParameterLocation.Header // No es necesario si Type es ApiKey
        },
        new List<string>() // O new string[] {} - Lista de scopes, usualmente vacía para Bearer simple
    }
});

});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins); // Habilita CORS

// --- INICIO  DE AUTENTICACIÓN Y AUTORIZACIÓN ---
app.UseAuthentication(); // PRIMERO: Verifica si hay un token y lo valida, estableciendo la identidad del usuario.
app.UseAuthorization();  // SEGUNDO: Verifica si el usuario autenticado tiene permiso para acceder al recurso.
// --- FIN  DE AUTENTICACIÓN Y AUTORIZACIÓN ---

app.MapControllers();

app.Run();
