namespace Find_Your_Home.Models.Rentals.DTO
{
    public class InfoDto
    {
        public DateTime? RentPaymentDate { get; set; }
        public DateTime? ElectricityPaymentDate { get; set; }
        public DateTime? WaterPaymentDate { get; set; }
        public DateTime? GasPaymentDate { get; set; }
        public DateTime? InternetPaymentDate { get; set; }

        //contacts
        public string? LandlordPhone { get; set; }
        public string? PlumberPhone { get; set; }
        public string? ElectricianPhone { get; set; }
        public string? GasServicePhone { get; set; }
        public string? InternetProviderPhone { get; set; }

        //contract details
        public bool? ContractSigned { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public string? RentAmount { get; set; }
    }
}