using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server.Models;

public class Node
{
    [Key]
    public string NodeId { get; set; }
    public required string Id { get; set; }
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
    public string Parent { get; set; } = "void";
    public List<Relation>? Children { get; set; }
    public List<Relation>? Terminals { get; set; }
    public string? TerminalOf { get; set; }
    public string? TransfersTo { get; set; }
    public string? TransferedBy { get; set; }
    public List<Relation>? ConnectedTo { get; set; }
    public string? ConnectedBy { get; set; }
    public string? DirectPartOf { get; set; }
    public List<Relation>? DirectParts { get; set; }
    public List<Relation>? FulfilledBy { get; set; }
    public List<Relation>? Fulfills { get; set; }
    public string? CustomName { get; set; }
    public required AspectType Aspect { get; set; }
    public required string Label { get; set; }
    public required long CreatedAt { get; set; }
    public required long UpdatedAt { get; set; }
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

public class Relation
{
    public required string Id { get; set; }
}
