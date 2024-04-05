using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using server.DAL;

namespace server.Models;

public class Edge
{
    [Key]
    public string EdgeId { get; set; }
    public required string Id { get; set; }
    public required string Source { get; set; }
    public required string SourceHandle { get; set; }
    public required string Target { get; set; }
    public required string TargetHandle { get; set; }
    public required EdgeType Type { get; set; }
    public required EdgeData Data { get; set; }

    public Edge()
    {
        EdgeId = Guid.NewGuid().ToString();
    }
}

public class EdgeData
{
    public required string Id { get; set; }
    public required long CreatedAt { get; set; }
    public required long UpdatedAt { get; set; }
    public required bool LockConnection { get; set; }
    public required string Label { get; set; }
    public required string CreatedBy { get; set; }
}

[JsonConverter(typeof(EdgeTypeConverter))]
public enum EdgeType
{
    Connected,
    Fulfilled,
    Part,
    Transfer
}
