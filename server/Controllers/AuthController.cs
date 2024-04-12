using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DAL;
using server.Models;

namespace server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(DB db, ILogger<AuthController> logger, IConfiguration configuration) : Controller
{
  private readonly DB _db = db;
  private readonly ILogger<AuthController> _logger = logger;
  private readonly IConfiguration _configuration = configuration;

  [HttpPost("login")]
  public async Task<IActionResult> Login(User user)
  {
    try
    {
      var usr = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

      byte[] salt = Convert.FromBase64String(usr?.Salt ?? "");

      var match = PasswordHasher.VerifyPassword(user.Password, salt, usr?.Password ?? "");

      if (!match || usr == null)
      {
        return BadRequest("Invalid credentials");
      }

      var token = JWT.GenerateJwtToken(user, _configuration);

      return Ok(new
      {
        Token = token,
        User = new
        {
          Id = usr.Id,
          Username = usr.Username,
          Role = usr.Role,
        },
      });
    }
    catch (DbUpdateException dbEx)
    {
      _logger.LogError("[AuthController]: Database fetch failed: {Error}", dbEx.Message);
      return StatusCode(500, "Failed login user due to database error.");
    }
    catch (Exception e)
    {
      _logger.LogError("[AuthController]: Failed login user: {Error}", e.Message);
      return StatusCode(500, "An unexpected error occurred.");
    }
  }

  [Route("register")]
  [HttpPost]
  public async Task<IActionResult> Register(User user)
  {
    try
    {
      var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Username == user.Username);

      if (existingUser != null)
      {
        return BadRequest("User with username " + user.Username + " already exists");
      }

      byte[] salt = PasswordHasher.GenerateSalt();

      string hashedPassword = PasswordHasher.HashPassword(user.Password, salt);

      user.Salt = Convert.ToBase64String(salt);
      user.Password = hashedPassword;
      user.Role = user.Role == UserRole.Admin ? UserRole.Admin : UserRole.User;

      await _db.Users.AddAsync(user);
      await _db.SaveChangesAsync();

      return Ok("User registered successfully");
    }
    catch (DbUpdateException dbEx)
    {
      _logger.LogError("[AuthController]: Database fetch failed: {Error}", dbEx.Message);
      return StatusCode(500, "Failed register user due to database error.");
    }
    catch (Exception e)
    {
      _logger.LogError("[AuthController]: Failed register user: {Error}", e.Message);
      return StatusCode(500, "An unexpected error occurred.");
    }
  }

  [HttpPost("token")]
  public Task<IActionResult> ValidateToken(TokenData token)
  {
    try
    {
      JWT.ValidateToken(token.Token, _configuration);

      return Task.FromResult<IActionResult>(Ok());
    }
    catch (Exception e)
    {
      _logger.LogError("[AuthController]: Failed to validate token: {Error}", e.Message);
      return Task.FromResult<IActionResult>(StatusCode(500, "An unexpected error occurred."));
    }
  }

}