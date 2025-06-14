namespace Find_Your_Home.Models.Questions
{
    public class QuestionRequest
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string AnswerText { get; set; } = string.Empty;
    }
}