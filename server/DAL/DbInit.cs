using server.Models;

namespace server.DAL
{
  public class DbInit
  {

    public static void Seed(IApplicationBuilder app)
    {
      using var serviceScope = app.ApplicationServices.CreateAsyncScope();
      DB context = serviceScope.ServiceProvider.GetRequiredService<DB>();

      context.Database.EnsureDeleted();
      context.Database.EnsureCreated();

      if (!context.Users.Any())
      {
        byte[] salt = PasswordHasher.GenerateSalt();

        string hashedPassword = PasswordHasher.HashPassword("admin", salt);

        User admin = new()
        {
          Username = "admin",
          Password = hashedPassword,
          Salt = Convert.ToBase64String(salt),
          Role = UserRole.Admin
        };

        context.Users.AddRange(admin);
        context.SaveChanges();
      }

      context.SaveChanges();
    }

  }
}
