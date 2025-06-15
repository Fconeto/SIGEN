using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace SIGEN.API.Middlewares
{
    public class AuthLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public AuthLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Path.StartsWithSegments("/api/auth/login") ||
                context.Request.Path.StartsWithSegments("/api/auth/register"))
            {
                System.Console.WriteLine($"[AuthMiddleware] Endpoint acessado: {context.Request.Path}");
            }
            await _next(context);
        }
    }
}
