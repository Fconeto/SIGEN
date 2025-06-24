using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared;
using RegisterRequestAPI = SIGEN.API.Requests.RegisterRequest;
using SIGEN.API.Mappers;
using SIGEN.API.Requests;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpGet("login")]
    public async Task<IActionResult> Login([FromQuery] SIGEN.Domain.Shared.LoginRequest request)
    {
        AuthResponse result = await _authService.LoginAsync(request);

        if (result.IsSuccess)
            return Ok(result);
        
        return Unauthorized(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestAPI request)
    {
        var registerRequest = AuthMapper.RegisterMapper(request);
        var result = await _authService.RegisterAsync(registerRequest);
        return Ok(result);
    }
}