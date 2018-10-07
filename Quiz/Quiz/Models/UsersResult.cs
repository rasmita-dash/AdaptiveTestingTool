using System;

namespace Quiz.Models
{
    public class UsersResult
    {
        public string CandidateName { get; set; }
        public int Aptitude { get; set; }
        public int Reasoning { get; set; }
        public int Technology { get; set; }        
        public int AptPercentile { get; set; }
        public int ResPercentile { get; set; }
        public int TechPercentile { get; set; }
    }
}