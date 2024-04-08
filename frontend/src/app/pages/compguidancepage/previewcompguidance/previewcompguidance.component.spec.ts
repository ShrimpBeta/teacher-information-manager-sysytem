import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewcompguidanceComponent } from './previewcompguidance.component';

describe('PreviewcompguidanceComponent', () => {
  let component: PreviewcompguidanceComponent;
  let fixture: ComponentFixture<PreviewcompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewcompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewcompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
