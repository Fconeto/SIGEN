using AutoMapper;
using SIGEN.API;
using SIGEN.API.Middlewares;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared;
using SIGEN.Infrastructure.Interfaces;
using SIGEN.Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Injeção de dependências
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IMapper, Mapper>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware customizado para logging de autenticação
app.UseMiddleware<AuthLoggingMiddleware>();

app.MapControllers();
app.UseHttpsRedirection();

app.Run();