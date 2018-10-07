import { Component, OnInit, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { QuizAppServiceComponent } from '../quiz-app-service/quiz-app-service.component';
import 'rxjs/add/operator/map';
import * as $ from 'jquery';
import { UserScore } from '../userScroreDTO';

@Component({
  selector: 'app-quiz-app',
  templateUrl: './quiz-app.component.html',
  styleUrls: ['./quiz-app.component.css']
  })

  
export class QuizAppComponent implements OnInit {
public correctCounter = 0;
public wrongCounter = 0;
public currentComplexity = 2;
public increaseComplexity = 4; // increase complexity at 3 correct answers
public decreaseComplexity = 2;
public options = ["Test1","Test2","Test3","Test4"];
public selectedOption: string;
public questionAnswered: QuestionsAnswered;
public questionsAnswered: Array<QuestionsAnswered>;
public allQuestions: any;
public questions: any;
public activeSection: string;
public currentSectionScore: number = 0;
public totalQuestionPerSection: number = 10;
public maxScore: number;
public sections: number = 0;
public questionNumber: number = 1;

$el;

public currentQuestion: any;
  constructor(private quizAppService: QuizAppServiceComponent,
    private el: ElementRef) { 
    this.questionAnswered = new QuestionsAnswered();
    this.questionsAnswered = new Array<QuestionsAnswered>();
    this.$el = $(el.nativeElement);
    this.isChangeSection = new EventEmitter();
    this.scoreForCurrentSection = new EventEmitter();
  }
  @Input() set currentSection(value: string)
  {
    this.activeSection = value;
  }
  @Output() isChangeSection: EventEmitter<any>;
  @Output() scoreForCurrentSection: EventEmitter<any>;
  SetCorrectCount(){;
    // this.getQuestions().subscribe(data => {
    //   this.apiResponse = data;
    // });
    this.correctCounter ++;
    if(this.wrongCounter > 0){
      this.wrongCounter--;
    }
    this.adaptiveAlgorithmForCorrect();
    //console.log("Correct: " + this.correctCounter);
  }
  SetWrongCount(){
    this.wrongCounter ++;
    if(this.correctCounter > 0){
      this.correctCounter--;
    }
    this.adaptiveAlgorithmForWrong();
  }
  public adaptiveAlgorithmForCorrect(){
    this.getCurrentSectionScore();
    this.correctCounter ++;
    if(this.correctCounter > 0 && (this.correctCounter % this.increaseComplexity) === 0) {// && this.wrongCounter <= this.decreaseComplexity){
      this.correctCounter = 0;
      if((this.currentComplexity * 2) >= this.correctCounter)
      if(this.currentComplexity < 4){
      this.currentComplexity++;
      }
    }
  }

  public adaptiveAlgorithmForWrong(){
    this.wrongCounter ++;
    if(this.wrongCounter > 0 && (this.wrongCounter % this.decreaseComplexity) === 0
   && this.currentComplexity > 1){
     this.wrongCounter = 0;
      this.currentComplexity--;
    }
  }

  getCurrentSectionScore(){
    let multipleBy = 2;
    if(this.currentComplexity > 2){
      multipleBy = 4;
    }
    // this.currentSectionScore = this.currentSectionScore + (this.currentComplexity * multipleBy);
    this.currentSectionScore = this.currentSectionScore + multipleBy;
  }
  
    getMaxScore(){
      let totalPoints = 0;
      var correctAnswer = 0;
      var curComplexity = 2;
      let multipleBy = 2;
      let previousScore = 0;
      
      let i: number=0;
      for(i=0; i< this.totalQuestionPerSection; i++){
        correctAnswer++;
        if(curComplexity > 2){
          multipleBy = 4;
              }
              if((curComplexity < 4) || (curComplexity === 4 && correctAnswer <= this.totalQuestionPerSection)){
        if((correctAnswer % multipleBy) === 0){
          totalPoints = (curComplexity * multipleBy);
          
        if((curComplexity * multipleBy)>= correctAnswer){
          previousScore = previousScore + totalPoints;
  if(curComplexity<4){
  curComplexity++;
        }
      }
    } 
      }
      else {
        previousScore = previousScore + 4;
      }
      }
      this.maxScore = previousScore;
      // console.log(previousScore);
    }

  onSelectionChange(option){
    this.questionAnswered = new QuestionsAnswered();
    this.questionAnswered.UserID = +$("#userDdl").val();
    this.selectedOption = option;
    if(this.currentQuestion.Answer === option)
    {
      this.questionAnswered.IsCorrect = true;
    } else {
      this.questionAnswered.IsCorrect = false;
    }
    this.questionAnswered.SelectedOption = option;
    this.questionAnswered.QuestionID = this.currentQuestion.Id;
    this.questionAnswered.Complexity = this.currentQuestion.Complexity;
    $("#nextBtn").prop('disabled', false);
    //console.log(this.questionAnswered);
  }

  nextQuestion(){
    this.questionNumber++;
    this.selectedOption = '';
    //var radioBtn = this.$el.find('input.radioBtn');    
    $("#nextBtn").prop('disabled', true);
    this.questionsAnswered.push(this.questionAnswered);
    $('input[name="radiogroup"]').prop('checked', false);
    if(this.questionAnswered.IsCorrect){
      this.adaptiveAlgorithmForCorrect();
    } else {
      this.adaptiveAlgorithmForWrong();
    }
    for(var i = 0; i < this.questions.length; i++) {
      if(this.questions[i].Id == this.questionAnswered.QuestionID) {
        this.questions.splice(i, 1);
          break;
      }
  }
    // var question = this.questions.filter(x=>x.Complexity === this.currentComplexity);
    var question = this.questions.filter(x=>x.Complexity === this.currentComplexity && x.Type == this.activeSection);
    
    if(this.questionNumber > this.totalQuestionPerSection){
      $("#submitTest").show();
      $(".showMessage").show();
      this.sections++;
    }
if(question && question.length >= 0)
this.currentQuestion = question[Math.floor(Math.random()*question.length)];
console.log("Answer: " + this.currentQuestion.Answer);
if(this.questionsAnswered && this.questionsAnswered.length > (this.totalQuestionPerSection - 1)){
  let scorePercent = (this.currentSectionScore/this.maxScore) * 100;
  this.scoreForCurrentSection.emit(parseInt(scorePercent.toString()));
  this.isChangeSection.emit(true);
  
  this.quizAppService.saveUserQuestion(this.questionsAnswered).subscribe(res=>{
    console.log(res);
  });
}
  }

  ngOnInit() {
    this.getMaxScore();
    this.quizAppService.getQuestions().subscribe(data => {
        this.allQuestions = JSON.parse(data);
        this.questions = JSON.parse(data);
        var question = this.questions.filter(x=>x.Complexity === this.currentComplexity && x.Type === this.activeSection);
        
        if(question && question.length >= 0){
        this.currentQuestion = question[0];
        console.log("Answer: " + this.currentQuestion.Answer);
          }
          
      setTimeout(()=>{
        $("#nextBtn").prop('disabled', true);
        $("#submitTest").hide();
        $(".showMessage").hide();
      }, 0); 
      });     
  }
}

class QuestionsAnswered{
  public UserID: number;
  public QuestionID: number;
  public SelectedOption: string;
  public IsCorrect: boolean;
  public Complexity: number;
}
