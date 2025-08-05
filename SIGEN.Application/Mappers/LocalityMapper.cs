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

    // public long LocalidadeId { get; set; }
    // public long CodigoDaLocalidade { get; set; }
    // public string? Nome { get; set; }
    // public string? Categoria { get; set; }
    // public DateTime DataDeRegistro { get; set; }
    // public DateTime DataDeAtualizacao { get; set; }
    // public long CriadoPor { get; set; }
    // public long AtualizadoPor { get; set; }
    public List<GetLocalityListResponse> Mapper(List<Locality> localities)
    {
        List<GetLocalityListResponse> result = new List<GetLocalityListResponse>();

        foreach (var locality in localities)
        {
            result.Add(new GetLocalityListResponse
            {
                LocalidadeId = locality.Id,
                CodigoDaLocalidade = locality.CodigoDaLocalidade,
                Nome = locality.Nome,
                Categoria = locality.Categoria,
                DataDeRegistro = (DateTime)locality.DataDeRegistro,
                DataDeAtualizacao = (DateTime)locality.DataDeAtualizacao,
                CriadoPor = (long)locality.CriadoPor,
                AtualizadoPor = (long)locality.AtualizadoPor
            });
        }
        return result;
    }
}