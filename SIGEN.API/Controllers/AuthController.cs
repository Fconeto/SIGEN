using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Services;
using SIGEN.Domain.Shared.Requests;
using SIGEN.API.Mappers;
using SIGEN.Domain.Shared.Responses;
using Application.UseCases.Agents.Register;
using Application.UseCases.REsidences.Create;

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
        var domainRequest = new SIGEN.Domain.Shared.Requests.LoginRequest();
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
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromServices] IRegisterAgentUseCase UseCase,
        [FromBody] RegisterRequest request)
    {
        var response = await UseCase.Execute(request);

        return Created(string.Empty, response);
    }

    [HttpPost("createResidence")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateResidence([FromServices] ICreateResidenceUseCase useCase,
        [FromBody] ResidenceCreateRequest request)
    {
        var response = await useCase.Execute(request);

        return Created(string.Empty, response);
    }
}