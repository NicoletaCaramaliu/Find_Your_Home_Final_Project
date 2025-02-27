using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace Find_Your_Home.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
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
            
            modelBuilder.Entity<Property>()
                .HasOne( p => p.Owner)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<PropertyImage>()
                .HasOne(pi => pi.Property)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            
            base.OnModelCreating(modelBuilder);
        }
    }
}