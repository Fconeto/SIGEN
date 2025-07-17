using SIGEN.Application.Interfaces;
using SIGEN.Application.Mappers;
using SIGEN.Application.Validators;
using SIGEN.Domain.Entities;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
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

            await _pitRepository.InsertPIT(entity);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }

    public async Task<SearchPITResponse> ConsultPIT(ConsultFiltersRequest request)
    {
        try
        {
            PITValidator validator = new PITValidator();
            validator.Validate(request);

            List<GetConsultPITListResponse> pendingPITs = await _pitRepository.GetPendingPITByFilters(request);
            List<GetConsultPITListResponse> completedPITs = await _pitRepository.GetPITByFilters(request);

            SearchPITResponse searchResponse = new SearchPITResponse
            {
                PITCompleted = pendingPITs,
                PendingPIT = completedPITs
            };

            return searchResponse;
        }
        catch (Exception ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }

    public async Task CreateSearchPIT(SearchPITRequest request)
    {
        try
        {
            SearchPITValidator validator = new SearchPITValidator();
            validator.Validate(request);

            SearchPITMapper searchPITMapper = new SearchPITMapper();
            SearchPIT entity = searchPITMapper.Map(request);

            await _pitRepository.InsertSearchPIT(entity);

            await _pitRepository.UpdatePesquisaPITById(entity.Id, entity.PITId);
        }
        catch (SigenValidationException ex)
        {
            throw new SigenValidationException(ex.Message);
        }
    }
}