using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;
using SIGEN.Domain.ExeptionsBase;
using SIGEN.Domain.Repositories;
using AutoMapper;

namespace SIGEN.Application.UseCases.Agents.Register;
    public class RegisterAgentUseCase
{
    private readonly IAgentWriteOnlyRepository _agentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RegisterAgentUseCase(IAgentWriteOnlyRepository agentRepository,
    IUnitOfWork unitOfWork,
    IMapper mapper)
    {
        _agentRepository = agentRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<AuthResponse> Execute(RegisterRequest request)
    {
        Validate(request);
        
        var entity = _mapper.Map<RegisterRequest>(request);

        await _agentRepository.Add(entity);

        await _unitOfWork.Commit();

        return _mapper.Map<AuthResponse>(entity);
    }
    private void Validate(RegisterRequest request)
    {
        var validator = new AgentValidator();

        var result = validator.Validate(request);

        if (result.IsValid == false)
        {
            var errorMessages = result.Errors.Select(e => e.ErrorMessage).ToList();
            
            throw new ErrorOnValidationException(errorMessages);
        }
    }
}