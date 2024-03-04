using Microsoft.EntityFrameworkCore;
using mymvc.Models;

namespace mymvc.DAL {
    public class ElementDbContext : DbContext {
    public ElementDbContext(DbContextOptions<ElementDbContext> options) : base(options) {
        Database.EnsureCreated();
        
    }
    public DbSet<Element> Elements { get; set;}

}
}