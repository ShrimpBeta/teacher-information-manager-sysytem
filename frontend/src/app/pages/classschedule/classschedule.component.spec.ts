import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassscheduleComponent } from './classschedule.component';

describe('ClassscheduleComponent', () => {
  let component: ClassscheduleComponent;
  let fixture: ComponentFixture<ClassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
