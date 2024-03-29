using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DAL;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

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


  [HttpPost("login")]
  public async Task<IActionResult> FetchUser(User user)
  {
    var usr = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
    if (usr == null)
    {
      return NotFound("User not found");
    }

    byte[] salt = Convert.FromBase64String(usr.Salt);

    var match = PasswordHasher.VerifyPassword(user.Password, salt, usr.Password);

    if (!match)
    {
      return BadRequest("Passwords do not match");
    }

    var token = GenerateJwtToken(usr.Username);

    return Ok(token);
  }


  [Route("create")]
  [HttpPost]
  public async Task<IActionResult> CreateUser(User user)
  {
    byte[] salt = PasswordHasher.GenerateSalt();

    string hashedPassword = PasswordHasher.HashPassword(user.Password, salt);

    user.Salt = Convert.ToBase64String(salt);
    user.Password = hashedPassword;

    await _db.Users.AddAsync(user);
    await _db.SaveChangesAsync();

    return Ok(user);
  }
  private string GenerateJwtToken(string Username)
  {
    var envKey = "vn6Kx+VuhLpeYe23epBjAsBjr9V6WXzjGhUP/vYWcRU=";

    var secretKey = Encoding.UTF8.GetBytes(envKey);
    var jwtTokenHandler = new JwtSecurityTokenHandler();

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, Username.ToString()) }),
      Expires = DateTime.UtcNow.AddHours(1),
      SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature)
    };

    return jwtTokenHandler.WriteToken(jwtTokenHandler.CreateToken(tokenDescriptor));
  }

}