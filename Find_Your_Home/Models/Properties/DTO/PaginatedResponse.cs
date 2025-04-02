namespace Find_Your_Home.Models.Properties.DTO
{
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; }
        public int TotalCount { get; set; }
    }
}