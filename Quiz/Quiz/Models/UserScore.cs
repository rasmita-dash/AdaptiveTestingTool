using System;

namespace Quiz.Models
{
    public class UserScore
    {
        public int UserID { get; set; }
        public int Aptitude { get; set; }
        public int Reasoning { get; set; }
        public int Technology { get; set; }
        public DateTime Created { get; set; }
    }
}