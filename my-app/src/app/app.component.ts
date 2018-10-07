import { Component, OnInit } from '@angular/core';
import { UserScore } from '../app/userScroreDTO';
import { QuizAppServiceComponent } from '../app/quiz-app-service/quiz-app-service.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
  title = 'TEK Adaptive Testing Tool - TATT!';
  sectionTimer: string;
  startTimerForSection : any;
  activeSection: number = 0;
  sectionTime = 10 * 60; // In Sec
  warnTime = 5;
  alertTime = 3;
  showWarning: boolean = false;
  showAlert: boolean = false;
  timerId: any;
  public currentSection: string;
  public userScore: UserScore;
  public showResult: boolean = false;
  public aptitudeLevel: string;
  public reasoningLevel: string;
  public technologyLevel: string;
  public isAdmin : boolean = false;


  constructor(private quizAppService: QuizAppServiceComponent){

  }
  ngOnInit(){
    this.userScore = new UserScore();
    // this.getTimer();
    setTimeout(this.getTimer(), 2000);
    //this.startTimerForSection = setInterval( () => this.getTimer(), this.sectionTime*1000);    
  }

getSection(){
  if(this.activeSection === 1){
this.currentSection = "Aptitude";
  } else if(this.activeSection === 2){
    this.currentSection = "Reasoning";
  } else {
    this.currentSection = "Technology";
  }
  return this.currentSection;
}

changeLogin(event: any){
  if(event.target.value === '5')
  {
    this.isAdmin = true;
  }
  //window.location.reload();
}

  getTimer(){
  this.activeSection = this.activeSection + 1;
  var countdown = this.sectionTime * 1000;
  this.showWarning = false;
  this.showAlert = false;
  var self = this;
  self.timerId = setInterval(function(){
    countdown -= 1000;
    // For showing alert & warning as time line is crossed
    self.showWarning = false;
    self.showAlert = false;
    if(self.alertTime *1000 >= countdown){
      self.showAlert = true;
    }
    else if(self.warnTime * 1000 >= countdown){
      self.showWarning = true;
    }
    var min = Math.floor(countdown / (60 * 1000));
    var sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);
    self.sectionTimer = min + " : " + sec;
    

    if (countdown <= 0) {
      clearInterval(self.timerId);
      //Load the next tab
      self.getNextSection(self.activeSection)
    }
  }, 1000);
}
getNextSection(sectionId){
  clearInterval(this.timerId);
  if(this.activeSection < 3){
  this.getTimer();
  //Get Question based on this.activeSection
  }  
}
changeCurrentSection($event)
{
  if(this.activeSection < 3){
   this.getNextSection((this.activeSection+1)); 
  }
}

setCurrentSectionScore($event)
{
  this.userScore.UserID = +$("#userDdl").val();;
  if(this.activeSection === 1){
  this.userScore.Aptitude = $event;
  } else if(this.activeSection === 2){
    this.userScore.Reasoning = $event;
    } else {
      this.userScore.Technology = $event;
      this.setResult();
    } 
}

setResult(){
  if(this.userScore.Aptitude < 59){
    this.aptitudeLevel = "Below Proficient";
  } else if(this.userScore.Aptitude > 60 && this.userScore.Aptitude <= 79){
    this.aptitudeLevel = "Moderately Proficient";
  } else if(this.userScore.Aptitude > 80 && this.userScore.Aptitude <= 90){
    this.aptitudeLevel = "Proficient";
  } else {
    this.aptitudeLevel = "Highly Proficient";
  }
  if(this.userScore.Reasoning < 59){
    this.reasoningLevel = "Below Proficient";
  } else if(this.userScore.Reasoning > 60 && this.userScore.Reasoning <= 79){
    this.reasoningLevel = "Moderately Proficient";
  } else if(this.userScore.Reasoning > 80 && this.userScore.Reasoning <= 90){
    this.reasoningLevel = "Proficient";
  } else {
    this.reasoningLevel = "Highly Proficient";
  }
  if(this.userScore.Technology < 59){
    this.technologyLevel = "Below Proficient";
  } else if(this.userScore.Technology > 60 && this.userScore.Technology <= 79){
    this.technologyLevel = "Moderately Proficient";
  } else if(this.userScore.Technology > 80 && this.userScore.Technology <= 90){
    this.technologyLevel = "Proficient";
  } else {
    this.technologyLevel = "Highly Proficient";
  }
}

ngOnDestroy() {
  if (this.startTimerForSection) {
    clearInterval(this.startTimerForSection);
  }
}
submitTest(){
  this.showResult = true;
  clearInterval(this.timerId);
  if(this.activeSection === 3){
    this.quizAppService.saveScoreCard(this.userScore).subscribe(res=>{
        console.log(res);
    });
  }
}

sendReport(){  
    this.quizAppService.sendReport().subscribe(res=>{
        if(res){
          $('#lblMessage').text("Email has been sent.")
        }
        console.log(res);
    });
  }
}


