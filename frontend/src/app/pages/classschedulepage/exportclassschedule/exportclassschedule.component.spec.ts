import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportclassscheduleComponent } from './exportclassschedule.component';

describe('ExportclassscheduleComponent', () => {
  let component: ExportclassscheduleComponent;
  let fixture: ComponentFixture<ExportclassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportclassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportclassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
