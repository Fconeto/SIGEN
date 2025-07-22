using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
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

    public async Task CreateSpray(SprayRequest request)
    {
        try
        {
            SprayValidator validator = new SprayValidator();
            validator.Validate(request);

            long? existingSearch = await _sprayRepository.GetSearchWithPendingSprayById(request.PesquisaId);

            if (existingSearch == null)
                throw new SigenValidationException("Não foi encontrada borrifação pendente para a pesquisa informada.");
            
            SprayMapper mapper = new SprayMapper();
            Spray spray = mapper.Mapper(request, request.AgenteId);

            await _sprayRepository.InsertBorrifacao(spray);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }
}