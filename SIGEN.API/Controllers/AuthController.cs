using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.API.Mappers;
using SIGEN.Domain.Shared.Responses;
using Application.Interfaces;

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
    public async Task<IActionResult> Login([FromQuery] LoginRequest request)
    {
        AuthResponse result = await _authService.LoginAsync(request);

        if (result.IsSuccess)
            return Ok(result);
        
        return Unauthorized(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromServices] IRegisterAgentService UseCase,
        [FromBody] RegisterRequest request)
    {
        var response = await UseCase.Execute(request);

        return Created(string.Empty, response);
    }
}