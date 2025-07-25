using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests
{
    public class CreateLocalityRequest
    {
        public long AgenteId { get; set; }
        public long CodigoDaLocalidade { get; set; }
        public string NomeDaLocalidade { get; set; }
        public Categoria CategoriaDaLocalidade { get; set; }
    }
}