using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]

public class PITController : ControllerBase
{
    private readonly IPITService _pitService;
    public PITController(IPITService pitService)
    {
        _pitService = pitService;
    }

    [HttpPost("create")]
    [Authorize]
    [ProducesResponseType(typeof(Response), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreatePIT([FromBody] PITRegisterRequest request)
    {
        Console.WriteLine($"[PITController] Requisição recebida no endpoint CreatePIT");
        await _pitService.CreatePIT(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Cadastro de PIT realizado com sucesso!",
            Data = null
        };

        return Ok(response);
    }

    [HttpGet("consult")]
    [Authorize]
    [ProducesResponseType(typeof(Response), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConsultPIT([FromQuery] ConsultFiltersRequest request)
    {
        Console.WriteLine($"[PITController] Requisição recebida no endpoint ConsultPIT");
        SearchPITResponse result = await _pitService.ConsultPIT(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta de PIT realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }

    [HttpPost("searchpit")]
    [Authorize]
    [ProducesResponseType(typeof(Response), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateSearchPIT([FromBody] SearchPITRequest request)
    {
        Console.WriteLine($"[PITController] Requisição recebida no endpoint CreateSearchPIT");
        await _pitService.CreateSearchPIT(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Pesquisa de PIT realizada com sucesso!",
            Data = null
        };

        return Ok(response);
    }
}