using System.ComponentModel.DataAnnotations;

namespace server.Models;
public class User
{
  [Key]
  public string Id { get; set; } = Guid.NewGuid().ToString();
  public string Username { get; set; } = string.Empty;
  public string Password { get; set; } = string.Empty;
  public string Salt { get; set; } = string.Empty;
}