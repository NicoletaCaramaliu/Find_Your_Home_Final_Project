namespace Find_Your_Home.Models.Reviews.DTO;

public class ReviewRequest
{
    public Guid TargetUserId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}