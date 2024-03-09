using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace server.Models;

public class Edge
{
    [Key]
    public string EdgeId { get; set; }
    public string Id { get; set; } = string.Empty;
    public string Source = string.Empty;
    public string SourceHandle = string.Empty;
    public string Target = string.Empty;
    public string TargetHandle = string.Empty;
    public EdgeType Type;
    public required EdgeData Data { get; set; }

    public Edge()
    {
        EdgeId = Guid.NewGuid().ToString();
    }
}

public class EdgeData
{
    public string? Id { get; set; }
    public long? CreatedAt { get; set; }
    public long? UpdatedAt { get; set; }
    public bool? LockConnection { get; set; }
    public string? Label { get; set; }
}

[JsonConverter(typeof(EdgeTypeConverter))]
public enum EdgeType
{
    Connected,
    Fulfilled,
    Part,
    Transfer
}
