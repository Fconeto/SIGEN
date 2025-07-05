using SIGEN.Domain.Shared.Enums;

namespace SIGEN.Domain.Shared.Requests;

public class GetResidenceListRequest
{
    public required long CodigoDaLocalidade { get; set; }
    public string? NomeDoMorador { get; set; }
    public int? NumeroDaCasa { get; set; }
    public string? NumeroDoComplemento { get; set; }
    public Order Order { get; set; } = Order.Ascending;
    public OrderType OrderType { get; set; } = OrderType.NumeroDoComplemento;
    public int Page { get; set; } = 1;
}
