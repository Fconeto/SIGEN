using SIGEN.Domain.Shared.Responses;
using SIGEN.Application.Interfaces;
using SIGEN.Infrastructure.Interfaces;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Application.Mappers;

namespace SIGEN.Application.Services;

public class LocalityService : ILocalityService
{
    private readonly ILocalityRepository _localityRepository;

    public LocalityService(ILocalityRepository localityRepository)
    {
        _localityRepository = localityRepository;
    }

    public async Task<List<GetLocalityListResponse>> GetLocalityList()
    {
        return await _localityRepository.GetLocalityList();
    }

    public async Task CreateLocality(CreateLocalityRequest request)
    {
        try
        {
            LocalityValidator.Validate(request);

            Locality existingLocality = await _localityRepository.GetLocalityByCode(request.CodigoDaLocalidade);

            if (existingLocality != null)
                throw new SigenValidationException("Já existe uma localidade com o código informado.");

            LocalityMapper mapper = new LocalityMapper();

            Locality locality = mapper.Mapper(request);

            await _localityRepository.CreateLocality(locality);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
        
    }
}
