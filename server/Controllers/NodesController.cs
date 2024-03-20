using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.DAL;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NodesController : Controller
{
    private readonly DB _db;
    private readonly ILogger<NodesController> _logger;

    public NodesController(DB db, ILogger<NodesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Node>>> FetchNodes()
    {
        try
        {
            var blocks = await _db.Nodes
                .OfType<Block>()
                .Include(b => b.Data)
                .AsNoTracking()
                .Select(b => new NodeDto
                {
                    NodeId = b.NodeId,
                    Id = b.Id,
                    Position = b.Position,
                    Type = b.Type,
                    Data = b.Data
                })
                .ToListAsync();

            var terminals = await _db.Nodes
                .OfType<Terminal>()
                .Include(t => t.Data)
                .AsNoTracking()
                .Select(t => new NodeDto
                {
                    NodeId = t.NodeId,
                    Id = t.Id,
                    Position = t.Position,
                    Type = t.Type,
                    Data = t.Data
                })
                .ToListAsync();

            var connectors = await _db.Nodes
                .OfType<Connector>()
                .Include(c => c.Data)
                .AsNoTracking()
                .Select(c => new NodeDto
                {
                    NodeId = c.NodeId,
                    Id = c.Id,
                    Position = c.Position,
                    Type = c.Type,
                    Data = c.Data
                })
                .ToListAsync();

            var allNodes = blocks.Concat(terminals).Concat(connectors).ToList();

            return Ok(allNodes);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[NodesController]: Database fetch failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to fetch nodes due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to fetch nodes: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> FetchNode(string id)
    {
        try
        {
            var node = await _db.Nodes.FindAsync(id);

            if (node == null)
            {
                throw new Exception("Node with id " + id + " does not exist");
            }

            return Ok(node);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[NodesController]: Database fetch failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to fetch nodes due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to fetch nodes: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateNode([FromBody] JsonElement data)
    {

        if (data.ValueKind == JsonValueKind.Undefined)
        {
            return BadRequest("Node data is missing.");
        }

        try
        {
            var type = data.GetProperty("type").GetString();
            var id = data.GetProperty("id").GetString();
            var label = data.GetProperty("data").GetProperty("label").GetString();
            var aspect = data.GetProperty("data").GetProperty("aspect").GetString();
            var position = new Position
            {
                X = data.GetProperty("position").GetProperty("x").GetDouble(),
                Y = data.GetProperty("position").GetProperty("y").GetDouble()
            };

            if (id == null || type == null || label == null || aspect == null)
            {
                return BadRequest("Node data is missing required fields.");
            }

            Node node = Utils.CreateNode(type, id, position, aspect, label);

            await _db.Nodes.AddAsync(node);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(FetchNode), new { id = node.Id }, node);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[NodesController]: Database update failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to save node data due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to create node: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNode(string id)
    {
        if (id == null) return BadRequest("Node id is missing.");

        try
        {
            var node = await _db.Nodes.FindAsync(id);

            if (node == null)
            {
                throw new Exception("Node with id " + id + " does not exist");
            }

            _db.Nodes.Remove(node);
            await _db.SaveChangesAsync();

            return Ok(await _db.Nodes.ToListAsync());
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[NodesController]: Database deletion failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to delete node due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to delete node with id {id}: {e}", id, e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateNode([FromBody] JsonElement data)
    {
        if (data.ValueKind == JsonValueKind.Undefined)
        {
            return BadRequest("Node data is missing.");
        }

        try
        {
            var type = data.GetProperty("type").GetString();
            var id = data.GetProperty("id").GetString();
            var position = new Position
            {
                X = data.GetProperty("position").GetProperty("x").GetDouble(),
                Y = data.GetProperty("position").GetProperty("y").GetDouble()
            };

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            switch (type)
            {
                case "block":
                    var blockToUpdate = await _db.Nodes.OfType<Block>().Include(b => b.Data).FirstOrDefaultAsync(b => b.Id == id);


                    if (blockToUpdate == null)
                    {
                        return NotFound("Block with id " + id + " does not exist.");
                    }

                    blockToUpdate.Position = position;

                    var blockData = JsonSerializer.Deserialize<BlockData>(data.GetProperty("data").GetRawText(), options);

                    if (blockData == null)
                    {
                        return BadRequest("Block data is missing required fields.");
                    }

                    blockToUpdate.Data = blockData;

                    _db.Nodes.Update(blockToUpdate);
                    await _db.SaveChangesAsync();

                    return CreatedAtAction(nameof(FetchNode), new { id = blockToUpdate.Id }, blockToUpdate);
                case "terminal":
                    var terminalToUpdate = await _db.Nodes.OfType<Terminal>().Include(t => t.Data).FirstOrDefaultAsync(t => t.Id == id);

                    if (terminalToUpdate == null)
                    {
                        return NotFound("Terminal with id " + id + " does not exist.");
                    }


                    var terminalData = JsonSerializer.Deserialize<TerminalData>(data.GetProperty("data").GetRawText(), options);

                    if (terminalData == null)
                    {
                        return BadRequest("Terminal data is missing required fields.");
                    }

                    terminalToUpdate.Data = terminalData;
                    terminalToUpdate.Position = position;

                    _db.Nodes.Update(terminalToUpdate);
                    await _db.SaveChangesAsync();

                    return CreatedAtAction(nameof(FetchNode), new { id = terminalToUpdate.Id }, terminalToUpdate);
                case "connector":
                    var connectorToUpdate = await _db.Nodes.OfType<Connector>().Include(c => c.Data).FirstOrDefaultAsync(c => c.Id == id);

                    if (connectorToUpdate == null)
                    {
                        return NotFound("Connector with id " + id + " does not exist.");
                    }

                    var connectorData = JsonSerializer.Deserialize<ConnectorData>(data.GetProperty("data").GetRawText(), options);

                    if (connectorData == null)
                    {
                        return BadRequest("Connector data is missing required fields.");
                    }

                    connectorToUpdate.Data = connectorData;
                    connectorToUpdate.Position = position;

                    _db.Nodes.Update(connectorToUpdate);
                    await _db.SaveChangesAsync();

                    return CreatedAtAction(nameof(FetchNode), new { id = connectorToUpdate.Id }, connectorToUpdate);
                default:
                    return BadRequest("Node type is not recognized.");
            }
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[NodesController]: Database update failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to update node data due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to update node: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }


}
