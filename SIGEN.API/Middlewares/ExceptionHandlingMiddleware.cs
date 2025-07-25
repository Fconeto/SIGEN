using Microsoft.AspNetCore.Http;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Responses;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace SIGEN.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            string message;
            if (ex is SigenValidationException)
            {
                message = ex.Message;
            }
            else
            {
                message = "Ocorreu um erro não identificado, por favor tente novamente mais tarde";
            }

            var response = new Response
            {
                IsSuccess = false,
                Message = message,
                Data = null
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
