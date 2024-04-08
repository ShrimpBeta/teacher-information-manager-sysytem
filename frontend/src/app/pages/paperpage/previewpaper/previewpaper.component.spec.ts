import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewpaperComponent } from './previewpaper.component';

describe('PreviewpaperComponent', () => {
  let component: PreviewpaperComponent;
  let fixture: ComponentFixture<PreviewpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewpaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
