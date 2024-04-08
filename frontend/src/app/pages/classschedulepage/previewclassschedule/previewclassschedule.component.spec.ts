import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewclassscheduleComponent } from './previewclassschedule.component';

describe('PreviewclassscheduleComponent', () => {
  let component: PreviewclassscheduleComponent;
  let fixture: ComponentFixture<PreviewclassscheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewclassscheduleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewclassscheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
