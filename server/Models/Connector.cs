namespace server.Models;

public class ConnectorData : NodeData
{
  public string ConnectedTo { get; set; } = string.Empty;
  public string ConnectedBy { get; set; } = string.Empty;
}

public class Connector : Node
{
  private Connector() : base(null, null, NodeType.Connector) { }

  public ConnectorData Data { get; set; }

  public Connector(string id, Position position, ConnectorData connectorData)
      : base(id, position, NodeType.Connector)
  {
    this.Data = connectorData;
  }
}
