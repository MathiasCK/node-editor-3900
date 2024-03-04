using Microsoft.AspNetCore.Mvc;
using mymvc.Models;
using mymvc.DAL;


namespace mymvc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ElementController : Controller
{
    private readonly ElementDbContext _DbContext;

    public ElementController(ElementDbContext dbContext){
        _DbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> CreateElement(Element element)
    {
        try {
            await _DbContext.Elements.AddAsync(element);
            await _DbContext.SaveChangesAsync();

            return Ok(element);
        } catch (Exception e) {
            return BadRequest("Could not create element: " + e.Message);
        };
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteElement(string id){
        try {
            var element = await _DbContext.Elements.FindAsync(id);

            if (element == null){
                throw new Exception("Element with id " + id + " does not exist");
            }

            _DbContext.Elements.Remove(element);
            await _DbContext.SaveChangesAsync();

            return Ok("Element deleted");
        } catch (Exception e) {
            return BadRequest("Could not delete element: " + e.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateElement(Element element){
        try {
            _DbContext.Elements.Update(element);
            await _DbContext.SaveChangesAsync();

            return Ok("Element updated");
        } catch (Exception e) {
            return BadRequest("Could not update element: " + e.Message);
        }
    }

   [HttpGet]
    public async Task<IActionResult> GetElement(string id){
        try {
            var element = await _DbContext.Elements.FindAsync(id);
            
            if (element == null){
                throw new Exception("Element with id " + id + " does not exist");
            }
            
            return Ok(element);
        } catch (Exception e) {
            return BadRequest("Could not find element: " + e.Message);
        }
    }
    
}
