using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using server.DAL;

namespace server.Models;

public class Edge {
    public int Id { get; set; }
    public string Source = string.Empty;
    public string SourceHandle = string.Empty;
    public string Target = string.Empty;
    public string TargetHandle = string.Empty;
    public EdgeType Type;
    public required EdgeData Data { get; set; }
}

public class EdgeData {
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
