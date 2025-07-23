using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

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

    // <summary>
    // Endpoint para realizar o login do agente.
    // </summary>
    // <param name="request">Dados de login do agente.</param>
    // <returns>Retorna um token de autenticação se o login for bem-sucedido.</returns>
    [HttpGet("login")]
    [ProducesResponseType(typeof(Response), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromQuery] LoginRequest request)
    {
        Console.WriteLine($"[AuthController] Requisição recebida no endpoint Login");
        LoginResponse result = await _authService.LoginAsync(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Login realizado com sucesso!",
            Data = result
        };
        
        return Ok(response);
    }

    // <summary>
    // Endpoint para registrar um novo agente.
    // </summary>
    // <param name="request">Dados do agente a ser registrado.</param>
    // <returns>Retorna uma resposta de sucesso ou erro.</returns>
    [HttpPost("register")]
    [Authorize]
    [ProducesResponseType(typeof(Response), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(Response), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        Console.WriteLine($"[AuthController] Requisição recebida no endpoint Register");
        await _authService.RegisterAsync(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Cadastro de agente realizado com sucesso!",
            Data = null
        };
        
        return Ok(response);
    }
}