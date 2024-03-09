using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.DAL;

public class DB : DbContext {
    public DB(DbContextOptions<DB> options) : base(options) {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Node>()
                .OwnsOne(n => n.Position);
        modelBuilder.Entity<Node>()
                .OwnsOne(n => n.Data);
        modelBuilder.Entity<Edge>()
                .OwnsOne(e => e.Data);
    }

    public DbSet<Node> Nodes { get; set;}
    public DbSet<Edge> Edges { get; set;}
}
