namespace mymvc.Models {
    public class Terminal {
    public int TerminalId { get; set; }
    public string User { get; set; } = string.Empty;
    public DateTime CreateTime { get; set; } 
    public string Medium { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public int BlockId { get; set; }
    public int ConnectorId { get; set; }
    public string? TransferTo { get; set; }
    public List<Connector>? ConnectedTo { get; set; }
    public List <Attribute>? Attributes { get; set; }
}
}