using Find_Your_Home.Models.Favorites;
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
        public DbSet<Favorite> Favorites { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .ToTable("Users")
                .HasKey(u => u.Id);

            //email and username are unique
            /*modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();*/
            
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Property>()
                .HasOne(p => p.Owner)
                .WithMany(u => u.Properties)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PropertyImage>()
                .HasOne(pi => pi.Property)
                .WithMany(p => p.Images)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade); 

            modelBuilder.Entity<Favorite>()
                .HasKey(f => f.Id);

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favorites)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Property)
                .WithMany(p => p.FavoritedBy)
                .HasForeignKey(f => f.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Favorite>()
                .HasIndex(f => new { f.UserId, f.PropertyId })
                .IsUnique();

            
            modelBuilder.Entity<Property>()
                .Property(p => p.Price)
                .HasColumnType("decimal(18,2)");

            base.OnModelCreating(modelBuilder);
        }
    }
}
