import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewugpgguidanceComponent } from './previewugpgguidance.component';

describe('PreviewugpgguidanceComponent', () => {
  let component: PreviewugpgguidanceComponent;
  let fixture: ComponentFixture<PreviewugpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewugpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewugpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
