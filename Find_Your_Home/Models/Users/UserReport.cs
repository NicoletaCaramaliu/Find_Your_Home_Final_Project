using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Users
{
    public class UserReport : BaseEntity
    {
        public Guid ReporterUserId { get; set; }

        public Guid ReportedUserId { get; set; }

        public string Reason { get; set; } = string.Empty;
    }
}