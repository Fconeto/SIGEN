using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet("pending")]
    [Authorize]
    [ProducesResponseType(typeof(GetPendingSearchResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetPendingSearch([FromQuery] ConsultFiltersRequest request)
    {
        List<GetPendingSearchResponse> result = await _searchService.GetPendingSearch(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }
}