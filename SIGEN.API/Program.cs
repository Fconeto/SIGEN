using SIGEN.API;
using SIGEN.API.Middlewares;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<SIGEN.Application.Services.IAuthService, SIGEN.Application.Services.AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseMiddleware<AuthLoggingMiddleware>();

app.Run();