using Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class PITService : IPITService
{
    private readonly IPITRepository _pitRepository;

    public PITService(IPITRepository pitRepository)
    {
        _pitRepository = pitRepository;
    }

    public async Task CreatePIT(PITRegisterRequest request)
    {
        try
        {
            PITValidator validator = new PITValidator();
            validator.Validate(request);

            PITMapper pitMapper = new PITMapper();
            PIT entity = pitMapper.Mapper(request);

            PIT existingPIT = await _pitRepository.GetPITByNumeracaoDoPitAndPesquisaId(
                entity.NumeracaoDoPit,
                entity.PesquisaId
            );

            await _pitRepository.InsertPIT(entity);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }
}