import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewclassscheduleComponent } from './newclassschedule.component';

describe('NewclassscheduleComponent', () => {
  let component: NewclassscheduleComponent;
  let fixture: ComponentFixture<NewclassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewclassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewclassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
