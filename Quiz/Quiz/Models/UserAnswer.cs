namespace Quiz.Models
{
    public class UserAnswer
    {
        public int UserID { get; set; }
        public int QuestionID { get; set; }
        public string SelectedOption { get; set; }
        public bool IsCorrect { get; set; }
        public int Complexity { get; set; }
    }
}