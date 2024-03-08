using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.DAL;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

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
            var nodes = await _db.Nodes.ToListAsync();
            return Ok(nodes);
        }
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to fetch all nodes: {e}", e.Message);
            return BadRequest("Could not fetch nodes: " + e.Message);
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
        catch (Exception e)
        {
            _logger.LogError("[NodesController]: Failed to fetch node with id {id}: {e}", id, e.Message);
            return BadRequest("Could not find node: " + e.Message);
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateNode(Node node)
    {
        if (node == null) return BadRequest("Node data is missing.");

        try
        {
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
            var node = await _db.Nodes.FindAsync(Int32.Parse(id));

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
    public async Task<IActionResult> UpdateNode(Node node)
    {
        if (node == null) return BadRequest("Node data is missing.");

        try
        {
            _db.Nodes.Update(node);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(FetchNode), new { id = node.Id }, node);
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
