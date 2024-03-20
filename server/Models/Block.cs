namespace server.Models;


public class BlockData : NodeData
{

    public string Parent { get; set; } = "void";
    public List<Relation> Children { get; set; } = new List<Relation>();
    public List<Relation> Terminals { get; set; } = new List<Relation>();
    public List<Relation> FulfilledBy { get; set; } = new List<Relation>();
    public List<Relation> Fulfills { get; set; } = new List<Relation>();
    public List<Relation> DirectParts { get; set; } = new List<Relation>();
    public string DirectPartOf { get; set; } = string.Empty;
}
public class Block : Node
{
    private Block() : base(null, null, NodeType.Block) { }

    public BlockData Data { get; set; }

    public Block(string id, Position position, BlockData blockData)
        : base(id, position, NodeType.Block)
    {
        this.Data = blockData;
    }

}
