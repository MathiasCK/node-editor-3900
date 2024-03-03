namespace mymvc.Models {
    public class Terminal {
    public int TerminalId { get; set; }
    public string User { get; set; } = string.Empty;
    public DateTime CreateTime { get; set; } 
    public string Medium { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public int BlockId { get; set; }
    public int ConnectorId { get; set; }
    public bool HasConnector { get; set; }

    public List<Connector> Connectors { get; set; } = new List<Connector>();
    public List<Terminal> TransferTo { get; set; } = new List<Terminal>();
    public List<Element> ConnectedTo { get; set; } = new List<Element>();
    public List<Attribute> Attributes { get; set; } = new List<Attribute>();
    public List<Block> TerminalOf { get; set; } = new List<Block>();
    public List<Terminal> FulfilledBy { get; set; } = new List<Terminal>();
    public List<Terminal> Fulfills { get; set; } = new List<Terminal>();
    public List<Block> PartOf { get; set; } = new List<Block>();
}
}