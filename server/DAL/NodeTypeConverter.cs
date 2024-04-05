using System.Text.Json;
using System.Text.Json.Serialization;
using server.Models;

namespace server.DAL;

public class NodeTypeConverter : JsonConverter<NodeType>
{
    public override NodeType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString() ?? throw new JsonException("Null, is not a valid NodeType.");
        return value.ToLower() switch
        {
            "block" => NodeType.Block,
            "terminal" => NodeType.Terminal,
            "connector" => NodeType.Connector,
            _ => throw new JsonException($"Value '{value}' is not recognized as a valid NodeType.")
        };
    }

    public override void Write(Utf8JsonWriter writer, NodeType value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            NodeType.Block => "block",
            NodeType.Terminal => "terminal",
            NodeType.Connector => "connector",
            _ => throw new JsonException($"'{value}' is not a valid NodeType value.")
        };
        writer.WriteStringValue(stringValue);
    }
}
