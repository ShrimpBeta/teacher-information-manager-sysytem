import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkreportComponent } from './workreport.component';

describe('WorkreportComponent', () => {
  let component: WorkreportComponent;
  let fixture: ComponentFixture<WorkreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
