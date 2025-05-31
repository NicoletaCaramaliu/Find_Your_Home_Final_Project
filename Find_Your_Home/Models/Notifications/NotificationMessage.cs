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
        public string SenderName { get; set; } // Numele expeditorului

        // Factory Methods

        public static NotificationMessage CreateBookingRequest(Booking booking, Guid senderId, string senderName)
        {
            return new NotificationMessage
            {
                Type = "booking-request",
                Title = "Cerere Nouă de Rezervare",
                Message = $"Ai o nouă cerere de rezervare de la {senderName}.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                SenderName = senderName,
                Data = new
                {
                    BookingId = booking.Id,
                    SlotDate = booking.SlotDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime
                }
            };
        }

        public static NotificationMessage CreateBookingAccepted(Booking booking, Guid senderId, string senderName)
        {
            return new NotificationMessage
            {
                Type = "booking-accepted",
                Title = "Rezervare Acceptată",
                Message = $"Rezervarea ta a fost acceptată de {senderName}.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                SenderName = senderName,
                Data = new
                {
                    BookingId = booking.Id
                }
            };
        }

        public static NotificationMessage CreateBookingRejected(Booking booking, Guid senderId, string senderName)
        {
            return new NotificationMessage
            {
                Type = "booking-rejected",
                Title = "Rezervare Respinsă",
                Message = $"Rezervarea ta a fost respinsă de {senderName}.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                SenderName = senderName,
                Data = new
                {
                    BookingId = booking.Id
                }
            };
        }
        
        public static NotificationMessage CreateBookingCancelled(Booking booking, Guid senderId, string senderName)
        {
            return new NotificationMessage
            {
                Type = "booking-cancelled",
                Title = "Rezervare Anulată",
                Message = $"Rezervarea ta a fost anulată de {senderName}.",
                Timestamp = DateTime.UtcNow,
                SenderId = senderId,
                SenderName = senderName,
                Data = new
                {
                    BookingId = booking.Id
                }
            };
        }
        
        public static NotificationMessage CreateReviewNotification(Guid reviewerId, string reviewerName, int rating)
        {
            return new NotificationMessage
            {
                Type = "new-review",
                Title = "Ai primit o recenzi!",
                Message = $"{reviewerName} ți-a oferit o notă de {rating} stele.",
                Timestamp = DateTime.UtcNow,
                SenderId = reviewerId,
                SenderName = reviewerName
            };
        }
        
        public static NotificationMessage CreateRentalInfo(Guid rentalId, string renterName)
        {
            return new NotificationMessage
            {
                Type = "rental-created",
                Title = "Proprietatea ta a fost închiriată",
                Message = $"{renterName} a închiriat una dintre proprietățile tale.",
                Timestamp = DateTime.UtcNow,
                Data = new { RentalId = rentalId },
                SenderName = renterName
            };
        }


    }
}
