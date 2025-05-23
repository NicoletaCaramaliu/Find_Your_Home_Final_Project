using Find_Your_Home.Models.Bookings;
using Find_Your_Home.Models.Chat;
using Find_Your_Home.Models.Favorites;
using Find_Your_Home.Models.Notifications;
using Find_Your_Home.Models.Properties;
using Find_Your_Home.Models.Rentals;
using Find_Your_Home.Models.Reviews;
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
        public DbSet<AvailabilitySlot> AvailabilitySlots { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BlockedInterval> BlockedIntervals { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Rental> Rentals { get; set; }
        public DbSet<RentalDocument> RentalDocuments { get; set; }
        public DbSet<RentalTask> RentalTasks { get; set; }
        public DbSet<RentalNote> RentalNotes { get; set; }


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
            
            modelBuilder.Entity<AvailabilitySlot>()
                .HasKey(a => a.Id);
            
            modelBuilder.Entity<AvailabilitySlot>()
                .HasOne(a => a.Property)
                .WithMany(p => p.AvailabilitySlots)
                .HasForeignKey(a => a.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Booking>()
                .HasKey(b => b.Id);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Property)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.AvailabilitySlot)
                .WithMany(s => s.Bookings)
                .HasForeignKey(b => b.AvailabilitySlotId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .Property(b => b.Status)
                .HasConversion<string>();
            
            modelBuilder.Entity<BlockedInterval>()
                .HasKey(bi => bi.Id);

            modelBuilder.Entity<BlockedInterval>()
                .HasOne(bi => bi.AvailabilitySlot)
                .WithMany(slot => slot.BlockedIntervals)
                .HasForeignKey(bi => bi.AvailabilitySlotId)
                .OnDelete(DeleteBehavior.Cascade);

            //NOTIF
            modelBuilder.Entity<Notification>()
                .HasKey(n => n.Id);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Sender)
                .WithMany()
                .HasForeignKey(n => n.SenderId)
                .OnDelete(DeleteBehavior.Restrict); 
            
            // CHAT
            modelBuilder.Entity<Conversation>()
                .HasKey(c => c.Id);

            modelBuilder.Entity<Conversation>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.User1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Conversation>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(c => c.User2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasKey(m => m.Id);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatMessage>()
                .Property(m => m.Message)
                .HasMaxLength(2000);
            
            modelBuilder.Entity<Review>()
                .HasKey(r => r.Id);
            
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Reviewer)
                .WithMany(u => u.ReviewsGiven)
                .HasForeignKey(r => r.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<Review>()
                .HasOne(r => r.TargetUser)
                .WithMany(u => u.ReviewsReceived)
                .HasForeignKey(r => r.TargetUserId)
                .OnDelete(DeleteBehavior.Restrict);
            
            //RENT
            modelBuilder.Entity<Rental>()
                .HasKey(r => r.Id);

            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Property)
                .WithMany(p => p.Rentals)
                .HasForeignKey(r => r.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Owner)
                .WithMany()
                .HasForeignKey(r => r.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rental>()
                .HasOne(r => r.Renter)
                .WithMany()
                .HasForeignKey(r => r.RenterId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<RentalDocument>()
                .HasKey(rd => rd.Id);
            
            modelBuilder.Entity<RentalDocument>()
                .HasOne(rd => rd.Rental)
                .WithMany()
                .HasForeignKey(rd => rd.RentalId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<RentalTask>()
                .HasKey(rt => rt.Id);
            modelBuilder.Entity<RentalTask>()
                .HasOne(rt => rt.Rental)
                .WithMany()
                .HasForeignKey(rt => rt.RentalId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<RentalNote>()
                .HasKey(rn => rn.Id);
            modelBuilder.Entity<RentalNote>()
                .HasOne(rn => rn.Rental)
                .WithMany()
                .HasForeignKey(rn => rn.RentalId)
                .OnDelete(DeleteBehavior.Cascade);
            

            base.OnModelCreating(modelBuilder);
        }
    }
}
