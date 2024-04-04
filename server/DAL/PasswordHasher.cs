using System;
using System.Security.Cryptography;
using System.Text;

namespace server.DAL;

public class PasswordHasher
{
    // Generate a salt using a cryptographic random number generator
    public static byte[] GenerateSalt(int saltSize = 16)
    {
        byte[] salt = new byte[saltSize];
        using (var rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(salt);
        }
        return salt;
    }

    // Hash the password using PBKDF2
    public static string HashPassword(string password, byte[] salt, int iterations = 10000, int hashSize = 32)
    {
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations))
        {
            byte[] hashBytes = pbkdf2.GetBytes(hashSize);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower(); // Convert bytes to hexadecimal string
        }
    }

    // Verify if the provided password matches the hashed password
    public static bool VerifyPassword(string password, byte[] salt, string hashedPassword, int iterations = 10000)
    {
        string hashedAttempt = HashPassword(password, salt, iterations, 32);
        Console.WriteLine("Hashed user password: " + hashedAttempt);
        return hashedPassword.Equals(hashedAttempt, StringComparison.OrdinalIgnoreCase);
    }
}