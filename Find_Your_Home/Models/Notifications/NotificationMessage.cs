using Find_Your_Home.Models.Bookings;

namespace Find_Your_Home.Models.Notifications
{
    public class NotificationMessage
    {
        public string Type { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public object Data { get; set; }
        public Guid? SenderId { get; set; } 

        // Factory Methods

        public static NotificationMessage CreateBookingRequest(Booking booking, Guid senderId)
        {
            return new NotificationMessage
            {
                Type = "booking-request",
                Title = "New Booking Request",
                Message = "You have a new booking to approve.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                Data = new
                {
                    BookingId = booking.Id,
                    SlotDate = booking.SlotDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime
                }
            };
        }

        public static NotificationMessage CreateBookingAccepted(Booking booking, Guid senderId)
        {
            return new NotificationMessage
            {
                Type = "booking-accepted",
                Title = "Booking Accepted",
                Message = "Your booking has been accepted.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                Data = new
                {
                    BookingId = booking.Id
                }
            };
        }

        public static NotificationMessage CreateBookingRejected(Booking booking, Guid senderId)
        {
            return new NotificationMessage
            {
                Type = "booking-rejected",
                Title = "Booking Rejected",
                Message = "Your booking has been rejected.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                Data = new
                {
                    BookingId = booking.Id
                }
            };
        }
    }
}
