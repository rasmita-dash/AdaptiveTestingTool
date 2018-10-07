using Quiz.BussinessLogic;
using Quiz.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Quiz.Controllers
{
    public class QuestionsController : ApiController
    {
        ProcessData processData;
        public QuestionsController()
        {
            this.processData = new ProcessData();
        }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            var result = processData.GetQuestions();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }    
            
        [HttpGet]
        public HttpResponseMessage GetAnsweredPercentage(int questionId)
        {
            var result = processData.GetAnsweredPercentage(questionId);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        public HttpResponseMessage PostAnswers([FromBody]List<UserAnswer> userAnswers)
        {
            var result = processData.PostUserAnswers(userAnswers);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpPost]
        public HttpResponseMessage PostScoreCard([FromBody]UserScore userScore)
        {
            var result = processData.PostScoreCard(userScore);
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        public HttpResponseMessage SendReport()
        {
            var result = processData.SendReport();
            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}
