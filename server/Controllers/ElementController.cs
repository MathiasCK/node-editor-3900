using Microsoft.AspNetCore.Mvc;

namespace mymvc.Controllers;

[ApiController]
[Route("api/[controller]")]
public class Element : Controller
{
    [HttpPost]
    public async Task<IActionResult> CreateElement(Element element){
        throw new NotImplementedException();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteElement(String id){
        throw new NotImplementedException();
    }

    [HttpPut]
    public async Task<IActionResult> UpdateElement(Element element){
        throw new NotImplementedException();
    }

    [HttpGet]
    public async Task<IActionResult> GetElement(String id){
        throw new NotImplementedException();
    }
}
