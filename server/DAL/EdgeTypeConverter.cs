using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using server.Models;

public class EdgeTypeConverter : JsonConverter<EdgeType>
{
    public override EdgeType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString() ?? throw new JsonException("Null, is not a valid EdgeType.");
        return value.ToLower() switch
        {
            "connected" => EdgeType.Connected,
            "fulfilled" => EdgeType.Fulfilled,
            "part" => EdgeType.Part,
            "transfer" => EdgeType.Transfer,
            _ => throw new JsonException($"Value '{value}' is not recognized as a valid EdgeType.")
        };
    }

    public override void Write(Utf8JsonWriter writer, EdgeType value, JsonSerializerOptions options)
    {
        var stringValue = value switch
        {
            EdgeType.Connected => "connected",
            EdgeType.Fulfilled => "fulfilled",
            EdgeType.Part => "part",
            EdgeType.Transfer => "transfer",
            _ => throw new JsonException($"'{value}' is not a valid EdgeType value.")
        };
        writer.WriteStringValue(stringValue);
    }
}
