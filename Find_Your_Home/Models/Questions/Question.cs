using Find_Your_Home.Models.Base;

namespace Find_Your_Home.Models.Questions
{
    public class Question : BaseEntity
    {
        public string QuestionText { get; set; } = string.Empty;
        public string AnswerText { get; set; } = string.Empty;
        public bool Posted { get; set; } = false; 
    }
}