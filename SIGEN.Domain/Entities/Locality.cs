using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Entities
{
    public class Locality : BaseEntity
    {
        public long Id { get; set; }
        public long CodigoDaLocalidade { get; set; }
        public string Nome { get; set; }
        public string Categoria { get; set; }
    }
}