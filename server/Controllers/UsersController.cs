using Microsoft.AspNetCore.Mvc;
using server.DAL;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : Controller
{
  private readonly DB _db;
  private readonly ILogger<UsersController> _logger;

  public UsersController(DB db, ILogger<UsersController> logger)
  {
    _db = db;
    _logger = logger;
  }

  [HttpGet]
  public string Test()
  {
    return "test";
  }
  [HttpPost]
  public async Task<IActionResult> FetchUser(User user)
  {
    throw new NotImplementedException();
  }

  [Route("create")]
  [HttpPost]
  public async Task<IActionResult> CreateUser(User user)
  {
    await _db.Users.AddAsync(user);
    await _db.SaveChangesAsync();

    return Ok(user);
  }

}