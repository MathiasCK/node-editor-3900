using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

    [HttpGet]
    public async Task<IActionResult> CreateElement()
    {
        var element = new Element
        {
            Id = "123",
            Type = "block",
            Height = 40,
            Width = 40
        };

        try {
            
            await _DbContext.Elements.AddAsync(element);
            Console.WriteLine("INSERTED");
        } catch (Exception e) {
            Console.WriteLine(e);
        };
        return Ok(element);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteElement(String id){
        throw new NotImplementedException();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateElement(Element element){
        throw new NotImplementedException();
    }

   /* [HttpGet]
    public async Task<IActionResult> GetElement(String id){
        throw new NotImplementedException();
    }
    */
}
