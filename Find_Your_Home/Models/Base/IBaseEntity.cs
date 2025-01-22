namespace Find_Your_Home.Models.Base
{
    public interface IBaseEntity
    {
        Guid Id { get; set; }
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}
