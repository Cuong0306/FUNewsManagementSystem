using FUNewsManagementSystem.BLL.Dtos;
using FUNewsManagementSystem.BLL.Dtos.Requests;
using FUNewsManagementSystem.BLL.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FUNewsManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;


        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(BaseResponse<string>.Fail("Invalid request data", 400));

            try
            {
                var result = await _authService.LoginAsync(dto);
                return Ok(BaseResponse<object>.Success(result, "Login successful"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed.");
                return Unauthorized(BaseResponse<string>.Fail("Invalid email or password", 401));
            }
        }
    } 
}