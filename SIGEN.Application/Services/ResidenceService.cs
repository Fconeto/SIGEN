using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Entities;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Validators;
using SIGEN.Application.Mappers;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class ResidenceService : IResidenceService
{
    private readonly IResidenceRepository _residenceRepository;

    public ResidenceService(IResidenceRepository residenceRepository)
    {
        _residenceRepository = residenceRepository;
    }

    public async Task<long> CreateResidence(ResidenceCreateRequest request)
    {
        try
        {
            ResidenceValidator validator = new ResidenceValidator();
            validator.Validate(request);

            ResidenceMapper residenceMapper = new ResidenceMapper();
            Residence entity = residenceMapper.Mapper(request);

            Residence existingResidence = await _residenceRepository.GetResidenciaByLocalidadeAndNumeroAndComplemento(
                entity.CodigoDaLocalidade,
                entity.Numero,
                entity.Complemento
            );

            if (existingResidence != null)
                throw new SigenValidationException("Já existe uma residência cadastrada com o mesmo número e complemento nessa localidade.");

            return await _residenceRepository.InsertResidence(entity);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }
    
    public async Task<List<GetResidenceListResponse>> GetResidenceList(ConsultFiltersRequest request)
    {
        try
        {
            ResidenceValidator validator = new ResidenceValidator();
            validator.Validate(request);

            List<GetResidenceListResponse> response = await _residenceRepository.GetResidenceListByFilters(
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