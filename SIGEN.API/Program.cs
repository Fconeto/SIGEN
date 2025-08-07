using SIGEN.API;
using SIGEN.API.Middlewares;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared;
using SIGEN.Infrastructure.Interfaces;
using SIGEN.Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? ""))
    };
});

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando o esquema Bearer.\r\n\r\n Exemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Injeção de dependências
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IPITService, PITService>();
builder.Services.AddScoped<IPITRepository, PITRepository>();
builder.Services.AddScoped<IResidenceService, ResidenceService>();
builder.Services.AddScoped<IResidenceRepository, ResidenceRepository>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<ISearchRepository, SearchRepository>();
builder.Services.AddScoped<ISprayService, SprayService>();
builder.Services.AddScoped<ISprayRepository, SprayRepository>();
builder.Services.AddScoped<ILocalityService, LocalityService>();
builder.Services.AddScoped<ILocalityRepository, LocalityRepository>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var config = services.GetRequiredService<IConfiguration>();
    var authService = services.GetRequiredService<IAuthService>();

    var adminSection = config.GetSection("AdminSeed");
    var cpf = adminSection["CPF"];
    var password = adminSection["Password"];
    var nome = adminSection["Name"];
    var matricula = long.TryParse(adminSection["Registration"], out var m) ? m : 1;
    var hierarquia = int.TryParse(adminSection["Hierarchy"], out var h) ? h : 1;
    var turma = int.TryParse(adminSection["Team"], out var t) ? t : 1;

    if (!string.IsNullOrEmpty(cpf) && !string.IsNullOrEmpty(password))
    {
        var registerRequest = new SIGEN.Domain.Shared.Requests.RegisterRequest
        {
            NomeDoAgente = nome,
            CPF = cpf,
            Senha = password,
            Matricula = matricula,
            Hierarquia = (SIGEN.Domain.Shared.Enums.Hierarquia)hierarquia,
            Turma = (SIGEN.Domain.Shared.Enums.Turma)turma
        };
        try
        {
            authService.RegisterAsync(registerRequest).Wait();
        }
        catch {}
    }
}

app.UseCors();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<AuthLoggingMiddleware>();

app.MapControllers();
app.UseHttpsRedirection();

app.Run();