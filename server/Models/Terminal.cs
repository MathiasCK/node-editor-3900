namespace server.Models;

public class TerminalDto
{
    public string NodeId { get; set; }
    public string Id { get; set; }
    public Position Position { get; set; }
    public NodeType Type { get; set; }
    public TerminalData Data { get; set; }
}

public class TerminalData : NodeData
{
  public string TerminalOf { get; set; } = string.Empty;
  public string ConnectedTo { get; set; } = string.Empty;
  public string ConnectedBy { get; set; } = string.Empty;
  public string TransfersTo { get; set; } = string.Empty;
  public string TransferedBy { get; set; } = string.Empty;
}

public class Terminal : Node
{
  private Terminal() : base(null, null, NodeType.Terminal) { }

  public TerminalData Data { get; set; }

  public Terminal(string id, Position position, TerminalData terminalData)
      : base(id, position, NodeType.Terminal)
  {
    this.Data = terminalData;
  }

}
