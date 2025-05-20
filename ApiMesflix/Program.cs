using Microsoft.EntityFrameworkCore;
using ApiMesflix.Data;

var builder = WebApplication.CreateBuilder(args);

// --- Add services to the container ---

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("MesflixDbConnection");
builder.Services.AddDbContext<MesflixDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// app.UseAuthorization();

app.MapControllers();

app.Run();
