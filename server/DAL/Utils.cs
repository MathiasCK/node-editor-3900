using server.Models;

public class Utils
{
  public static Node CreateNode(string type, string id, Position position, string aspect, string label)
  {
    AspectType parsedAspect = (AspectType)Enum.Parse(typeof(AspectType), aspect, ignoreCase: true);
    NodeData data = new() { Label = label, Aspect = parsedAspect };

    return type.ToLower() switch
    {
      "block" => new Block(id, position, new BlockData() { Label = data.Label, Aspect = data.Aspect }),
      "connector" => new Connector(id, position, new ConnectorData() { Label = data.Label, Aspect = data.Aspect }),
      "terminal" => new Terminal(id, position, new TerminalData() { Label = data.Label, Aspect = data.Aspect }),
      _ => throw new ArgumentException($"Unsupported node type: {type}"),
    };
  }

}