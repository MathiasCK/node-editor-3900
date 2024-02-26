namespace mymvc.Models {
    public class Block {
    public int BlockId { get; set; }
    public string User { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Perspective { get; set; } = string.Empty;
    public string Modality { get; set; } = string.Empty;
    public string Aspect { get; set; } = string.Empty;
    public DateTime CreateTime { get; set; }
    public List<Terminal>? Terminals { get; set; }
    public List<Connector>? Connectors { get; set; }
    public bool HasTerminal { get; set; }
    public bool HasConnector { get; set; }
    public List<Block>? HasPart { get; set; }
    public List<Block>? PartOf { get; set; }
    public List<Block>? HasDirectPart { get; set; }
    public List<Block>? FullfilledBy { get; set; }
    public List<Block>? Fullfills { get; set; }
    public List <Attribute>? Attributes { get; set; }
}
}