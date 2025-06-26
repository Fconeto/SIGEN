using SIGEN.Domain.Repositories;
using AutoMapper;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Entities;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Validators;

namespace SIGEN.Application.Services;

public class CreateResidenceService : ICreateResidenceService
{
    private readonly IResidenceWriteOnlyRepository _residenceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateResidenceService(IResidenceWriteOnlyRepository residenceRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _residenceRepository = residenceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResidenceCreateResponse> Execute(ResidenceCreateRequest request)
    {
        Validate(request);

        var entity = _mapper.Map<SIGEN.Domain.Entities.Residence>(request);

        await _residenceRepository.Add(entity);

        await _unitOfWork.Commit();
        return _mapper.Map<ResidenceCreateResponse>(entity);
    }

    private void Validate(ResidenceCreateRequest request)
    {
        var validator = new ResidenceValidator();

        var result = validator.Validate(request);
        if (!result.IsValid == false)
        {
            var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
            
            throw new ErrorOnValidationException(errorMessages);
        }
    }
}