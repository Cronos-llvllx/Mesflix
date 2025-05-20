using Microsoft.EntityFrameworkCore;
using ApiMesflix.Data;
using ApiMesflix.Models;

// --- Define  nombre para  política CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// --- Añade el servicio CORS ANTES de AddControllers ---
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy  =>
                      {
                          policy.WithOrigins("http://localhost:4200") // La URL de tu app Angular
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// Add services to the container.
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("MesflixDbConnection");
builder.Services.AddDbContext<MesflixDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- Usa la política CORS ANTES de UseAuthorization y MapControllers ---
app.UseCors(MyAllowSpecificOrigins);

// app.UseAuthorization(); // Descomenta cuando implementes autenticación basada en tokens

app.MapControllers();

app.Run();
