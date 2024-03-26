import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditclassscheduleComponent } from './editclassschedule.component';

describe('EditclassscheduleComponent', () => {
  let component: EditclassscheduleComponent;
  let fixture: ComponentFixture<EditclassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditclassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditclassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
