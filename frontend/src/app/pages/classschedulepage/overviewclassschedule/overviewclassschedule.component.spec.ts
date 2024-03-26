import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewclassscheduleComponent } from './overviewclassschedule.component';

describe('OverviewclassscheduleComponent', () => {
  let component: OverviewclassscheduleComponent;
  let fixture: ComponentFixture<OverviewclassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewclassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewclassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
