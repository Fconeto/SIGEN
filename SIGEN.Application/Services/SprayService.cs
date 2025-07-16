using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class SprayService : ISprayService
{
    private readonly ISprayRepository _sprayRepository;

    public SprayService(ISprayRepository sprayRepository)
    {
        _sprayRepository = sprayRepository;
    }

    public async Task CreateSpray(SprayRequest request)
    {
        try
        {
            SprayValidator validator = new SprayValidator();
            validator.Validate(request);

            long? heaveSearch = await _sprayRepository.GetSearchWithPendingSprayById(request.PesquisaId);

            if (heaveSearch == null)
            {
                throw new SigenValidationException("Pesquisa pendente!");
            }
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