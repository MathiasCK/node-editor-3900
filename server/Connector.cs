public class Connector {
    public int connectorId { get; set; }
    public DateTime createtime { get; set; }
    public string user { get; set; }
    public string medium { get; set; }
    public string direction { get; set; }
    public int blockId { get; set; }
    public int terminalId { get; set; }
    public Terminal? hasTerminal { get; set; }
    public List <Attribute> attributes { get; set; }
}