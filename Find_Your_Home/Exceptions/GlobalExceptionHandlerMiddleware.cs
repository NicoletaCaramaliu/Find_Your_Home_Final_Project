using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace Find_Your_Home.Exceptions
{
    public class GlobalExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

        public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (AppException ex)
            {
                _logger.LogWarning(ex, "Handled application exception");
                await HandleExceptionAsync(context, ex.ErrorCode, HttpStatusCode.BadRequest, ex);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled server exception");
                await HandleExceptionAsync(context, "INTERNAL_SERVER_ERROR", HttpStatusCode.InternalServerError, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, string errorCode, HttpStatusCode statusCode, Exception? ex = null)
        {
            var env = context.RequestServices.GetRequiredService<IWebHostEnvironment>();
            bool isDevelopment = env.IsDevelopment();

            string? fullMessage = ex?.Message;
            string? innerMessage = ex?.InnerException?.Message;

            // Concatenează toate inner exception messages (recursiv)
            Exception? currentEx = ex?.InnerException;
            while (currentEx?.InnerException != null)
            {
                innerMessage += " --> " + currentEx.InnerException.Message;
                currentEx = currentEx.InnerException;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var result = JsonSerializer.Serialize(new
            {
                errorCode,
                message = fullMessage,
                innerMessage,
                stackTrace = isDevelopment ? ex?.StackTrace : null
            });

            await context.Response.WriteAsync(result);
        }

    }
}