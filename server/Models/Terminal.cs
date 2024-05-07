namespace server.Models;

public class TerminalDto
{
  public required string Id { get; set; }
  public required Position Position { get; set; }
  public NodeType Type { get; set; }
  public required TerminalData Data { get; set; }
}

public class TerminalData : NodeData
{
  public string TerminalOf { get; set; } = string.Empty;
  public List<Relation> ConnectedTo { get; set; } = [];
  public List<Relation> ConnectedBy { get; set; } = [];
  public string TransfersTo { get; set; } = string.Empty;
  public string TransferedBy { get; set; } = string.Empty;
}

public class Terminal : Node
{
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
#pragma warning disable CS8625 // Cannot convert null literal to non-nullable reference type.
  private Terminal() : base(null, null, NodeType.Terminal) { }
#pragma warning restore CS8625 // Cannot convert null literal to non-nullable reference type.
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

  public TerminalData Data { get; set; }

  public Terminal(string id, Position position, TerminalData terminalData)
      : base(id, position, NodeType.Terminal)
  {
    Data = terminalData;
  }

}
