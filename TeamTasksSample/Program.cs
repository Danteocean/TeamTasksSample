using infrastructure;
using Microservice.core;

var builder = WebApplication.CreateBuilder(args);

// Cargar controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:4201", "http://localhost:4200", "http://localhost:4202")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Core
builder.Services.AddCoreLayer();

// Infraestructura: EF + repositorios
builder.Services.AddDbContexts(builder.Configuration);
builder.Services.AddRepository();



var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseAuthorization();
app.MapControllers();
app.Run();