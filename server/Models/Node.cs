using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

public class Node
{
    [Key]
    public string NodeId { get; set; }
    public string Id { get; set; }
    public required NodeData Data { get; set; }
    public required Position Position { get; set; }
    public required NodeType Type { get; set; }

    public Node()
    {
        NodeId = Guid.NewGuid().ToString();
    }
}

public class Position
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class NodeData
{
    public AspectType Aspect { get; set; }
    public bool? HasTerminal { get; set; }
    [NotMapped]
    public List<Relation>? Terminals { get; set; }
    [NotMapped]
    public List<Relation>? TerminalOf { get; set; }
    public string? TransfersTo { get; set; }
    public string? TransferedBy { get; set; }
    [NotMapped]
    public List<Relation>? ConnectedTo { get; set; }
    public bool? HasDirectPart { get; set; }
    [NotMapped]
    public List<Relation>? DirectParts { get; set; }
    public string? DirectPartOf { get; set; }
    [NotMapped]
    public List<Relation>? FulfilledBy { get; set; }
    [NotMapped]
    public List<Relation>? FullFills { get; set; }
    public string? Id { get; set; }
    public string? Label { get; set; }
    public string? Type { get; set; }
    public long CreatedAt { get; set; }
    public long UpdatedAt { get; set; }
    public string? CustomName { get; set; } = string.Empty;
}

[JsonConverter(typeof(AspectTypeConverter))]
public enum AspectType
{
    Function,
    Product,
    Location,
    Empty
}

[JsonConverter(typeof(NodeTypeConverter))]
public enum NodeType
{
    Block,
    Terminal,
    Connector,
}

public struct Relation
{
    public string Id { get; set; }
}
