using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class ResidenceController : ControllerBase
{
    private readonly ICreateResidenceService _useCase;

    public ResidenceController(ICreateResidenceService useCase)
    {
        _useCase = useCase;
    }
    
    [HttpPost("createResidence")]
    [ProducesResponseType(typeof(ResidenceCreateResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateResidence([FromBody] ResidenceCreateRequest request)
    {
        var response = await _useCase.Execute(request);

        return Created(string.Empty, response);
    }
}