namespace mymvc.Models {
    public class Connector {
    public int ConnectorId { get; set; }
    public DateTime Createtime { get; set; }
    public string User { get; set; } = string.Empty;
    public string Medium { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public int BlockId { get; set; }
    public int TerminalId { get; set; }
    public Terminal? HasTerminal { get; set; }
    public List <Attribute>? Attributes { get; set; }
}
}