using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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


  [HttpPost]
  public async Task<IActionResult> FetchUser(User user)
  {
    var usr = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username && u.Password == user.Password);
    if (usr == null){
      return NotFound("User not found");
    }
    return Ok(usr);
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