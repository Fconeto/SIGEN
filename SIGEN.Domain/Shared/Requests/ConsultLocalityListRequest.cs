using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class ConsultLocalityListRequest
{
    public long? CodigoDaLocalidade { get; set; }
    public string? Nome { get; set; }
    public int? Categoria { get; set; }
    public Order Order { get; set; } = Order.Ascending;
    public LocalityOrderType OrderType { get; set; } = LocalityOrderType.CodigoDaLocalidade;
    public int Page { get; set; } = 1;
}
