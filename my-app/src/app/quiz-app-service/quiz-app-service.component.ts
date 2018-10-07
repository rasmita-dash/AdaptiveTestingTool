
import {Injectable} from "@angular/core"
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()
export class QuizAppServiceComponent {

  constructor(private http: Http) { }

  getQuestions(): Observable<any> {
    return this.http.get('http://localhost/Quiz/api/questions/get')
    .map((res)=> JSON.parse(JSON.stringify(res))._body);
  }

  saveUserQuestion(userQA):Observable<any>{
    var postValue = JSON.stringify(userQA);
    var headers = new Headers();
        headers.append('Content-Type', 'application/json');
  const params = new URLSearchParams();
  params.append('mypostField', 'myFieldValue');
  var testPost = this.http.post('http://localhost/Quiz/api/questions/postanswers', postValue, { headers: headers })
  .map(response => {
      var json = response.json();
      return json;
  }).catch((err)=>{
    console.log(err);
return err;
  }).share();
  return testPost;
  }

  saveScoreCard(userScoreCard):Observable<any>{
    var postValue = JSON.stringify(userScoreCard);
    var headers = new Headers();
        headers.append('Content-Type', 'application/json');
  const params = new URLSearchParams();
  params.append('mypostField', 'myFieldValue');
  var testPost = this.http.post('http://localhost/Quiz/api/questions/PostScoreCard', postValue, { headers: headers })
  .map(response => {
      var json = response.json();
      return json;
  }).catch((err)=>{
    console.log(err);
return err;
  }).share();
  return testPost;
  }

  sendReport(): Observable<any> {
    return this.http.get('http://localhost/Quiz/api/questions/sendreport');
  }
}
