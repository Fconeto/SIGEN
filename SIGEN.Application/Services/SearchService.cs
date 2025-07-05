using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Entities;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Validators;
using SIGEN.Application.Mappers;
using SIGEN.Infrastructure.Interfaces;

namespace SIGEN.Application.Services;

public class SearchService : ISearchService
{
    private readonly ISearchRepository _searchRepository;

    public SearchService(ISearchRepository searchRepository)
    {
        _searchRepository = searchRepository;
    }
    
    public async Task<List<GetPendingSearchResponse>> GetPendingSearch(ConsultFiltersRequest request)
    {
        try
        {
            SearchValidator validator = new SearchValidator();
            validator.Validate(request);

            List<GetPendingSearchResponse> response = await _searchRepository.GetPendingSearchListByFilters(
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