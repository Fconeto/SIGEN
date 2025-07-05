using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResidenceController : ControllerBase
{
    private readonly IResidenceService _residenceService;

    public ResidenceController(IResidenceService residenceService)
    {
        _residenceService = residenceService;
    }

    [HttpPost("createresidence")]
    [Authorize]
    [ProducesResponseType(typeof(ResidenceCreateResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateResidence([FromBody] ResidenceCreateRequest request)
    {
        await _residenceService.CreateResidence(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Cadastro de residência realizado com sucesso!",
            Data = null
        };

        return Created(string.Empty, response);
    }
    
    [HttpGet("getresidencelist")]
    [Authorize]
    [ProducesResponseType(typeof(GetResidenceListResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetResidenceList ([FromQuery] GetResidenceListRequest request)
    {
        List<GetResidenceListResponse> result = await _residenceService.GetResidenceList(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }
}