namespace mymvc.Models {
    public class Block {
    public int BlockId { get; set; }
    public string User { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Perspective { get; set; } = string.Empty;
    public string Modality { get; set; } = string.Empty;
    public string Aspect { get; set; } = string.Empty;
    public DateTime CreateTime { get; set; }
    public bool HasTerminal { get; set; }
    public bool HasConnector { get; set; }

    public List<Terminal> Terminals { get; set; } = new List<Terminal>();
    public List<Connector> Connectors { get; set; } = new List<Connector>();
    public List<Block> HasPart { get; set; } = new List<Block>();
    public List<Block> PartOf { get; set; } = new List<Block>();
    public List<Block> HasDirectPart { get; set; } = new List<Block>();
    public List<Block> FulfilledBy { get; set; } = new List<Block>();
    public List<Block> Fulfills { get; set; } = new List<Block>();
    public List <Element> ConnectTo { get; set; } = new List<Element>();
    public List <Attribute> Attributes { get; set; } = new List<Attribute>();
}
}