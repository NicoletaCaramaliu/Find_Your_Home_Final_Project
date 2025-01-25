using Find_Your_Home.Models.User;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
            

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //User table
            modelBuilder.Entity<User>()
                .ToTable("Users")
                .HasKey(u => u.Id); 
            
            modelBuilder.Entity<User>().ToTable("Users")
                .HasIndex(u => u.Email)
                .IsUnique();
            
            
            base.OnModelCreating(modelBuilder);
        }
    }
}