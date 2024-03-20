using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using server.Models;

namespace server.DAL;

public class DB : DbContext
{
    public DB(DbContextOptions<DB> options) : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Node>()
                .HasDiscriminator<string>("NodeType")
                .HasValue<Block>("Block")
                .HasValue<Terminal>("Terminal")
                .HasValue<Connector>("Connector");

        modelBuilder.Entity<Node>()
                .OwnsOne(n => n.Position);
        modelBuilder.Entity<Node>().HasKey(e => e.NodeId);
        modelBuilder.Entity<Node>().Property(e => e.NodeId).HasMaxLength(255);

        modelBuilder.Entity<Terminal>().OwnsOne(t => t.Data);
        modelBuilder.Entity<Connector>().OwnsOne(c => c.Data);
        modelBuilder.Entity<Block>()
                    .OwnsOne(n => n.Data, data =>
                    {
                        data.Property(nd => nd.Children)
                            .HasConversion(
                                v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                                v => JsonSerializer.Deserialize<List<Relation>>(v, new JsonSerializerOptions()))
                            .HasColumnType("json");

                        data.Property(nd => nd.Terminals)
                            .HasConversion(
                                v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                                v => JsonSerializer.Deserialize<List<Relation>>(v, new JsonSerializerOptions()))
                            .HasColumnType("json");

                        data.Property(nd => nd.DirectParts).HasConversion(
                            v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                            v => JsonSerializer.Deserialize<List<Relation>>(v, new JsonSerializerOptions()))
                            .HasColumnType("json");

                        data.Property(nd => nd.Fulfills).HasConversion(
                            v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                            v => JsonSerializer.Deserialize<List<Relation>>(v, new JsonSerializerOptions()))
                            .HasColumnType("json");

                        data.Property(nd => nd.FulfilledBy).HasConversion(
                            v => JsonSerializer.Serialize(v, new JsonSerializerOptions()),
                            v => JsonSerializer.Deserialize<List<Relation>>(v, new JsonSerializerOptions()))
                            .HasColumnType("json");
                    });

        modelBuilder.Entity<Edge>()
.OwnsOne(e => e.Data);
        modelBuilder.Entity<Edge>().HasKey(e => e.EdgeId);
        modelBuilder.Entity<Edge>().Property(e => e.EdgeId).HasMaxLength(255);
    }

    public DbSet<Node> Nodes { get; set; }
    public DbSet<Edge> Edges { get; set; }
}
