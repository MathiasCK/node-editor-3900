public class Block {
    public int blockId { get; set; }
    public string user { get; set; }
    public string name { get; set; }
    public string perspective { get; set; }
    public string modality { get; set; }
    public string aspect { get; set; }
    public DateTime createTime { get; set; }
    public List<Terminal>? hasTerminal { get; set; }
    public List<Connector>? hasConnector { get; set; }
}