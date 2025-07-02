using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Rentals
{
    public class RentalInfo : BaseEntity
    {
        public Guid RentalId { get; set; }
        
        //dates
        public DateTime? RentPaymentDate { get; set; }
        public bool RentPaymentReminderSent { get; set; }
        public DateTime? ElectricityPaymentDate { get; set; }
        public bool ElectricityPaymentReminderSent { get; set; }
        public DateTime? WaterPaymentDate { get; set; }
        public bool WaterPaymentReminderSent { get; set; }
        public DateTime? GasPaymentDate { get; set; }
        public bool GasPaymentReminderSent { get; set; }
        public DateTime? InternetPaymentDate { get; set; }
        public bool InternetPaymentReminderSent { get; set; }

        //contacts
        public string? LandlordPhone { get; set; }
        public string? PlumberPhone { get; set; }
        public string? ElectricianPhone { get; set; }
        public string? GasServicePhone { get; set; }
        public string? InternetProviderPhone { get; set; }
        public string? EmergencyContact { get; set; }

        //contract details
        public bool? ContractSigned { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public string? RentAmount { get; set; }

        public Rental? Rental { get; set; }
        
    }
}