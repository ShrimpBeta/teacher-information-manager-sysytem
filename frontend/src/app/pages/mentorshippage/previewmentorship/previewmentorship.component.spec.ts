import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewmentorshipComponent } from './previewmentorship.component';

describe('PreviewmentorshipComponent', () => {
  let component: PreviewmentorshipComponent;
  let fixture: ComponentFixture<PreviewmentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewmentorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewmentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
