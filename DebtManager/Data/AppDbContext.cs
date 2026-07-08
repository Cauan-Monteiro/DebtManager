using Microsoft.EntityFrameworkCore;
using DebtManager.Entities;

namespace DebtManager.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Person> People { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
    }
}