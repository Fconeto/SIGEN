using SIGEN.Domain.Repositories;
using AutoMapper;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Entities;
using SIGEN.Application.Interfaces;
using SIGEN.Application.Validators;

namespace SIGEN.Application.Services;

public class ResidenceService : IResidenceService
{
    private readonly IResidenceRepository _residenceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ResidenceService(IResidenceRepository residenceRepository, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _residenceRepository = residenceRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ResidenceCreateResponse> CreateResidence(ResidenceCreateRequest request)
    {

        var entity = _mapper.Map<SIGEN.Domain.Entities.Residence>(request);

        await _residenceRepository.Add(entity);

        await _unitOfWork.Commit();
        return _mapper.Map<ResidenceCreateResponse>(entity);
    }
}