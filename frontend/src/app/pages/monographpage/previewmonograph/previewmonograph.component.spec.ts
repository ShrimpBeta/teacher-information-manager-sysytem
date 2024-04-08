import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewmonographComponent } from './previewmonograph.component';

describe('PreviewmonographComponent', () => {
  let component: PreviewmonographComponent;
  let fixture: ComponentFixture<PreviewmonographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewmonographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewmonographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
