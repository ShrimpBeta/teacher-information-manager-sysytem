import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewsciresearchComponent } from './previewsciresearch.component';

describe('PreviewsciresearchComponent', () => {
  let component: PreviewsciresearchComponent;
  let fixture: ComponentFixture<PreviewsciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewsciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewsciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
