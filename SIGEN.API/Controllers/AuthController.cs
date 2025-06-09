using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared;
using RegisterRequestAPI = SIGEN.API.Requests.RegisterRequest;
using SIGEN.API.Mappers;

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

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var domainRequest = new SIGEN.Domain.Shared.LoginRequest();
        domainRequest.Email = request.Email;
        domainRequest.Password = request.Password;
        var result = await _authService.LoginAsync(domainRequest);
        if (result.IsSuccess)
        {
            return Ok(result);
        }
        return Unauthorized(result);
    }

    [HttpPost("register")]

    public async Task<IActionResult> Register([FromBody] RegisterRequestAPI request)
    {
        RegisterRequest registerRequest = AuthMapper.RegisterMapper(request);
        var result = _authService.RegisterAsync(registerRequest);
        
        return Ok(result);
    }
}