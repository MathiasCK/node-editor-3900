using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.DAL;

namespace server.Models;

public class NodeDto
{
    public string NodeId { get; set; }
    public string Id { get; set; }
    public Position Position { get; set; }
    public NodeType Type { get; set; }
    public NodeData Data { get; set; }
}

public abstract class Node
{
    [Key]
    public string NodeId { get; set; } = Guid.NewGuid().ToString();
    public string Id { get; set; }
    public Position Position { get; set; }
    public NodeType Type { get; set; }

    public Node(string id, Position position, NodeType type)
    {
        this.Id = id;
        this.Position = position;
        this.Type = type;
    }
}

public class Position
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class Relation
{
    public required string Id { get; set; }
}

public class NodeData
{
    public string CustomName { get; set; } = string.Empty;
    public AspectType Aspect { get; set; } = AspectType.Empty;
    public string Label { get; set; } = string.Empty;
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
    public long UpdatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
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
