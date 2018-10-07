import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAppServiceComponent } from './quiz-app-service.component';

describe('QuizAppServiceComponent', () => {
  let component: QuizAppServiceComponent;
  let fixture: ComponentFixture<QuizAppServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizAppServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAppServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
