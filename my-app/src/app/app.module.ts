import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule, Http } from '@angular/http';
import { AppComponent } from './app.component';
import { QuizAppComponent } from './quiz-app/quiz-app.component';
import { QuizAppServiceComponent } from './quiz-app-service/quiz-app-service.component';


@NgModule({
  declarations: [
    AppComponent,
    QuizAppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [AppComponent,QuizAppServiceComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
