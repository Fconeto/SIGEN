using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocalityController : ControllerBase
{
    private readonly ILocalityService _localityService;

    public LocalityController(ILocalityService localityService)
    {
        _localityService = localityService;
    }

    [HttpGet("consultlocality")]
    [Authorize]
    [ProducesResponseType(typeof(GetLocalityListResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConsultLocality()
    {
        List<GetLocalityListResponse> result = await _localityService.GetLocalityList();

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }
}