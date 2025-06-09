using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly SIGEN.Application.Services.IAuthService _authService;

    public AuthController(SIGEN.Application.Services.IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] SIGEN.API.Requests.LoginRequest request)
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
    public async Task<IActionResult> Register([FromBody] SIGEN.API.Requests.RegisterRequest request)
    {
        var domainRequest = new SIGEN.Domain.Shared.RegisterRequest();
        domainRequest.Email = request.Email;
        domainRequest.Password = request.Password;
        domainRequest.Name = request.Name;
        var result = await _authService.RegisterAsync(domainRequest);
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(Login), new { email = request.Email }, result);
        }
        return BadRequest(result);
    }
}