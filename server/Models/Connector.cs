namespace mymvc.Models {
    public class Connector {
    public int ConnectorId { get; set; }
    public DateTime Createtime { get; set; }
    public string User { get; set; } = string.Empty;
    public string Medium { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;
    public int BlockId { get; set; }
    public int TerminalId { get; set; }

    public List<Connector> ConnectorOf1 { get; set; } = new List<Connector>();
    public List<Connector> ConnectorOf2 { get; set; } = new List<Connector>();
    public List<Element> ConnectTo1 { get; set; } = new List<Element>();
    public List<Element> ConnectTo2 { get; set; } = new List<Element>();
    public List<Connector> FulfilledBy { get; set; } = new List<Connector>();
    public List<Connector> Fulfills { get; set; } = new List<Connector>();
    public List<Block> PartOf { get; set; } = new List<Block>();
    public List <Attribute> Attributes { get; set; } = new List<Attribute>();
}
}