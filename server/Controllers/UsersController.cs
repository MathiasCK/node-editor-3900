using System;
using System.Text;
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
    var usr = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
    if (usr == null){
      return NotFound("User not found");
    }

    byte[] salt = PasswordHasher.GenerateSalt();

    Console.WriteLine("User: " + usr.Username);
    Console.WriteLine("Password: " + usr.Password);

    var match = PasswordHasher.VerifyPassword(user.Password, salt, usr.Password);

    if (match == false) {
      return BadRequest("Passwords do not match");
    }

    return Ok(usr);
  }

  [Route("create")]
  [HttpPost]
  public async Task<IActionResult> CreateUser(User user)
  {
   
   byte[] salt = PasswordHasher.GenerateSalt();

    // Hash the password
    string hashedPassword = PasswordHasher.HashPassword(user.Password, salt);

    user.Password = hashedPassword;

    await _db.Users.AddAsync(user);
    await _db.SaveChangesAsync();

    return Ok(user);
  }

}