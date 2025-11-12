using System.Net;
using System.Text.Json;

namespace ElectricVehicleDealer.API.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context); // gọi middleware tiếp theo

                // ✅ Trường hợp Unauthorized (401)
                if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
                {
                    await WriteJsonResponseAsync(context, "Unauthorized access. Please login first.", 401);
                }

                // ✅ Trường hợp Forbidden (403)
                else if (context.Response.StatusCode == (int)HttpStatusCode.Forbidden)
                {
                    await WriteJsonResponseAsync(context, "Forbidden access. You do not have permission to access this resource.", 403);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception occurred.");

                if (!context.Response.HasStarted)
                {
                    await WriteJsonResponseAsync(context,
                        "An unexpected error occurred. Please try again later.",
                        500,
                        new { detail = ex.Message }); // có thể bỏ detail nếu production
                }
                else
                {
                    _logger.LogWarning("Response đã bắt đầu, middleware không thể ghi phản hồi lỗi.");
                }
            }
        }

        private async Task WriteJsonResponseAsync(HttpContext context, string message, int statusCode, object? data = null)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new
            {
                message,
                statusCode,
                data
            };

            var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false
            });

            await context.Response.WriteAsync(json);
        }
    }
}
