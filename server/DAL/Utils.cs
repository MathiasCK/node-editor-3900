using server.Models;

namespace server.DAL;

public class Utils
{
  public static Node CreateNode(string type, string id, Position position, string aspect, string label, string createdBy)
  {
    AspectType parsedAspect = (AspectType)Enum.Parse(typeof(AspectType), aspect, ignoreCase: true);
    NodeData data = new() { Label = label, Aspect = parsedAspect };

    return type.ToLower() switch
    {
      "block" => new Block(id, position, new BlockData() { Label = data.Label, Aspect = data.Aspect, CreatedBy = createdBy }),
      "connector" => new Connector(id, position, new ConnectorData() { Label = data.Label, Aspect = data.Aspect, CreatedBy = createdBy }),
      "terminal" => new Terminal(id, position, new TerminalData() { Label = data.Label, Aspect = data.Aspect, CreatedBy = createdBy }),
      _ => throw new ArgumentException($"Unsupported node type: {type}"),
    };
  }

}