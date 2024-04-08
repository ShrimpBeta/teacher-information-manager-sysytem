import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportugpgguidanceComponent } from './exportugpgguidance.component';

describe('ExportugpgguidanceComponent', () => {
  let component: ExportugpgguidanceComponent;
  let fixture: ComponentFixture<ExportugpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportugpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportugpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
