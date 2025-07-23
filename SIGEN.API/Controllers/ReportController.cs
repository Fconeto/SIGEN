using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGEN.Application.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("consult")]
    [Authorize]
    [ProducesResponseType(typeof(ReportWeeklyResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Response), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConsultReport([FromQuery] ReportWeeklyRequest request)
    {
        Console.WriteLine($"[ReportController] Requisição recebida no endpoint ConsultReport");
        var result = await _reportService.GetWeeklyReport(request);

        Response response = new Response
        {
            IsSuccess = true,
            Message = "Consulta de relatório semanal realizada com sucesso!",
            Data = result
        };

        return Ok(response);
    }
}
