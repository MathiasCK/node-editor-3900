public class Terminal {
    public int terminalId { get; set; }
    public string user { get; set; }
    public DateTime createTime { get; set; }
    public string medium { get; set; }
    public string direction { get; set; }
    public int blockId { get; set; }
    public int connectorId { get; set; }
    public string? transferTo { get; set; }
    public List<Connector>? connectedTo { get; set; }
    public List <Attribute> attributes { get; set; }
}