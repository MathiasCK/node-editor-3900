using Microsoft.AspNetCore.Mvc;
using server.Models;
using server.DAL;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EdgesController : Controller
{
    private readonly DB _db;
    private readonly ILogger<EdgesController> _logger;

    public EdgesController(DB db, ILogger<EdgesController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Edge>>> FetchEdges()
    {
        try
        {
            var edges = await _db.Edges.ToListAsync();
            return Ok(edges);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[EdgesController]: Database fetch failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to fetch edges due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[EdgesController]: Failed to fetch edges: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> FetchEdge(string id)
    {
        try
        {
            var edge = await _db.Edges.FindAsync(id);

            if (edge == null)
            {
                throw new Exception("Edge with id " + id + " does not exist");
            }

            return Ok(edge);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[EdgesController]: Database fetch failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to fetch edges due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[EdgesController]: Failed to fetch edges: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateEdge(Edge edge)
    {
        if (edge == null) return BadRequest("Edge data is missing.");

        try
        {
            await _db.Edges.AddAsync(edge);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(FetchEdge), new { id = edge.Id }, edge);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[EdgesController]: Database update failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to save edge data due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[EdgesController]: Failed to create edge: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEdge(string id)
    {
        if (id == null) return BadRequest("Edge id is missing.");

        try
        {
            var edge = await _db.Edges.FindAsync(id);

            if (edge == null)
            {
                throw new Exception("Edge with id " + id + " does not exist");
            }

            _db.Edges.Remove(edge);
            await _db.SaveChangesAsync();

            return Ok(await _db.Edges.ToListAsync());
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[EdgesController]: Database deletion failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to delete edge due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[EdgesController]: Failed to delete edge with id {id}: {e}", id, e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateEdge(Edge edge)
    {
        if (edge == null) return BadRequest("Edge data is missing.");

        try
        {
            _db.Edges.Update(edge);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(FetchEdge), new { id = edge.Id }, edge);
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError("[EdgesController]: Database update failed: {Error}", dbEx.Message);
            return StatusCode(500, "Failed to update edge data due to database error.");
        }
        catch (Exception e)
        {
            _logger.LogError("[EdgesController]: Failed to update edge: {Error}", e.Message);
            return StatusCode(500, "An unexpected error occurred.");
        }
    }
}
