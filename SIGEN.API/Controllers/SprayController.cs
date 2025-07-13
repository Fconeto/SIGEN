using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SprayController : ControllerBase
{
    private readonly ISprayService _sprayService;

    public SprayController(ISprayService sprayService)
    {
        _sprayService = sprayService;
    }

    [HttpGet("pending")]
    [Authorize]
    [ProducesResponseType(typeof(GetPendingSprayResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetPendingSpray([FromQuery] ConsultFiltersRequest request)
    {
        List<GetPendingSprayResponse> result = await _sprayService.GetPendingSpray(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }
}