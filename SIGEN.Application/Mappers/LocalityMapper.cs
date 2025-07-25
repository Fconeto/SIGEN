using SIGEN.Domain.Entities;
using SIGEN.Domain.Shared.Requests;
using SIGEN.Domain.Shared.Responses;

namespace SIGEN.Application.Mappers;

public class LocalityMapper
{
    
    public Locality Mapper(CreateLocalityRequest request)
    {
        return new Locality
        {
            CodigoDaLocalidade = request.CodigoDaLocalidade,
            Nome = request.NomeDaLocalidade,
            Categoria = Enum.GetName(request.CategoriaDaLocalidade),
            DataDeRegistro = DateTime.Now,
            DataDeAtualizacao = DateTime.Now,
            CriadoPor = request.AgenteId,
            AtualizadoPor = request.AgenteId
        };
    }
}