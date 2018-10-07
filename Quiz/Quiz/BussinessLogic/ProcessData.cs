using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Mail;
using System.Text.RegularExpressions;

namespace Quiz.BussinessLogic
{
    public class ProcessData
    {
        private string ConnectionString = string.Empty;
        public ProcessData()
        {
            this.ConnectionString = "initial catalog = ForcedToHack; data source = ASI-PF0EEACB;User Id=TATT;Password=tatt@123;";
        }

        public List<Question> GetQuestions()
        {
            var questions = new List<Question>();
            try
            {
                //Create the SQL Query for returning an Question
                string sqlQuery = "select * from Question";

                //Create and open a connection to SQL Server
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(sqlQuery, connection);

                    SqlDataReader dataReader = command.ExecuteReader();

                    //load into the result object the returned row from the database
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            questions.Add(new Question
                            {
                                Id = Convert.ToInt32(dataReader["ID"]),
                                Text = Convert.ToString(dataReader["Text"]),
                                Type = Convert.ToString(dataReader["Type"]),
                                Complexity = Convert.ToInt32(dataReader["Complexity"]),
                                Option1 = Convert.ToString(dataReader["Option1"]),
                                Option2 = Convert.ToString(dataReader["Option2"]),
                                Option3 = Convert.ToString(dataReader["Option3"]),
                                Option4 = Convert.ToString(dataReader["Option4"]),
                                Answer = Convert.ToString(dataReader["Answer"])
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return questions;
        }
        public int GetAnsweredPercentage(int questionID)
        {
            int avg = 0;
            try
            {
                var answers = new List<UserAnswer>();

                //Create the SQL Query for returning an Question
                string sqlQuery = string.Format("select * from UserAnswers where QuestionID = {0}", questionID);

                //Create and open a connection to SQL Server
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(sqlQuery, connection);

                    SqlDataReader dataReader = command.ExecuteReader();

                    //load into the result object the returned row from the database
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            answers.Add(new UserAnswer
                            {
                                QuestionID = Convert.ToInt32(dataReader["ID"]),
                                IsCorrect = Convert.ToBoolean(dataReader["IsCorrect"]),
                                SelectedOption = Convert.ToString(dataReader["SelectedOption"]),
                                UserID = Convert.ToInt32(dataReader["UserID"])
                            });
                        }
                    }
                }

                int answersCount = answers.Count;
                int correctAnswersCount = answers.Where(x => x.IsCorrect == true).ToList().Count;
                avg = (correctAnswersCount / answersCount) * 100;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            return avg;
        }
        public bool PostUserAnswers(List<UserAnswer> userAnswers)
        {
            try
            {
                foreach (var userAns in userAnswers)
                {
                    //Create the SQL Query for inserting an UserAnswers
                    string insertUserAns = String.Format("Insert into UserAnswers (UserID,QuestionID,SelectedOption,IsCorrect,Complexity) Values('{0}', '{1}', '{2}', {3}, {4} )"
                        , userAns.UserID, userAns.QuestionID, userAns.SelectedOption, userAns.IsCorrect == true ? 1 : 0, userAns.Complexity);

                    using (SqlConnection connection = new SqlConnection(ConnectionString))
                    {
                        connection.Open();
                        SqlCommand command = new SqlCommand(insertUserAns, connection);
                        var commandResult = command.ExecuteScalar();
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
                //there was a problem executing the script
            }
            return true;
        }
        public bool PostScoreCard(UserScore userScore)
        {
            try
            {
                //Create the SQL Query for inserting an UserAnswers

                string deleteStr = "Delete from userscore where UserID =" + userScore.UserID;
                string insertUserAns = String.Format("Insert into UserScore (UserID,Aptitude,Reasoning,Technology) Values('{0}', '{1}', '{2}', {3} )"
                    , userScore.UserID, userScore.Aptitude, userScore.Reasoning, userScore.Technology);

                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open(); 
                    SqlCommand command = new SqlCommand(deleteStr, connection);
                    SqlCommand commandInsert = new SqlCommand(insertUserAns, connection);
                    var commandResult = command.ExecuteScalar();
                    var commandInsertResult = commandInsert.ExecuteScalar();
                }
            }
            catch (Exception ex)
            {
                throw ex;
                //there was a problem executing the script
            }
            return true;
        }

        public bool SendReport()
        {
            var candidateList = new List<UsersResult>();
            candidateList = GetCandidateList();
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com");

                mail.From = new MailAddress("harishhn05@gmail.com");
                mail.To.Add("hhn@teksystems.com");
                mail.To.Add("sgopalap@teksystems.com");
                mail.Subject = "Score Card";
                mail.IsBodyHtml = true;
                mail.Body = EmailBody(candidateList);

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential("harishhn05", "9880005534hnh");
                SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return true;
        }
        private string EmailBody(List<UsersResult> candidateList)
        {
            string rows = string.Empty;
            foreach (var candidate in candidateList)
            {
                rows += string.Format("<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td></tr>", candidate.CandidateName, candidate.Aptitude, candidate.Reasoning, candidate.Technology);
            }
            string htmlBody = "<html><head></head><body><h2> Candidates Score Card </h2><table><tr><th>Candidate Name</th><th>Aptitude<br />(percentile)</th><th>Reasoning<br />(percentile)</th><th>Technology<br />(percentile)</th><th>Recommendations</th></tr> rowsFromReport </table></body></html>";
            string pattern = String.Format(@"\b{0}\b", "rowsFromReport");
            string ret = Regex.Replace(htmlBody, pattern, rows, RegexOptions.IgnoreCase);
            return ret;
        }
        public List<UsersResult> GetCandidateList()
        {
            var usersScore = new List<UsersResult>();
            try
            {
                //Create the SQL Query for returning an Question
                string sqlQuery = "select U.Name,US.Aptitude,US.Reasoning,US.Technology from UserScore US join [User] U on U.ID = US.UserID";

                //Create and open a connection to SQL Server
                using (SqlConnection connection = new SqlConnection(ConnectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(sqlQuery, connection);

                    SqlDataReader dataReader = command.ExecuteReader();

                    //load into the result object the returned row from the database
                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            usersScore.Add(new UsersResult
                            {
                                CandidateName = Convert.ToString(dataReader["Name"]),
                                Aptitude = Convert.ToInt32(dataReader["Aptitude"]),
                                Reasoning = Convert.ToInt32(dataReader["Reasoning"]),
                                Technology = Convert.ToInt32(dataReader["Technology"])
                            });
                        }
                    }
                    //int totalCount = usersScore.Count;
                    //foreach (var user in usersScore)
                    //{
                    //    user.AptPercentile = (usersScore.Where(x => x.Aptitude < user.Aptitude).ToList().Count/ totalCount)*100;
                    //    user.ResPercentile = usersScore.Where(x => x.Reasoning < user.Reasoning).ToList().Count;
                    //    user.TechPercentile = usersScore.Where(x => x.Technology < user.Technology).ToList().Count;
                    //}
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return usersScore;
        }
    }
}