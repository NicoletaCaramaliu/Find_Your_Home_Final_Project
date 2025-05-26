using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Rentals
{
    public class RentalInfo : BaseEntity
    {
        public Guid RentalId { get; set; }
        
        //dates
        public string RentPaymentDay { get; set; }
        public string ElectricityPaymentDay { get; set; }
        public string WaterPaymentDay { get; set; }
        public string GasPaymentDay { get; set; }
        public string InternetPaymentDay { get; set; }

        //contacts
        public string LandlordPhone { get; set; }
        public string PlumberPhone { get; set; }
        public string ElectricianPhone { get; set; }
        public string GasServicePhone { get; set; }
        public string InternetProviderPhone { get; set; }
        public string EmergencyContact { get; set; }

        //contract details
        public bool ContractSigned { get; set; }
        public string ContractStartDate { get; set; }
        public string ContractEndDate { get; set; }
        public string RentAmount { get; set; }

        public Rental Rental { get; set; }
        
    }
}