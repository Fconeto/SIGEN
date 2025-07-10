using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Entities;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Validators;
using SIGEN.Application.Mappers;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class SprayService : ISprayService
{
    private readonly ISprayRepository _sprayRepository;

    public SprayService(ISprayRepository sprayRepository)
    {
        _sprayRepository = sprayRepository;
    }

    public async Task<List<GetPendingSprayResponse>> GetPendingSpray(ConsultFiltersRequest request)
    {
        try
        {
            SprayValidator validator = new SprayValidator();
            validator.Validate(request);

            List<GetPendingSprayResponse> response = await _sprayRepository.GetPendingSprayListByFilters(
                request.CodigoDaLocalidade,
                request.NomeDoMorador,
                request.NumeroDaCasa,
                request.NumeroDoComplemento,
                request.Order,
                request.OrderType,
                request.Page
            );

            return response;
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }
}