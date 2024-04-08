import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewpasswordComponent } from './previewpassword.component';

describe('PreviewpasswordComponent', () => {
  let component: PreviewpasswordComponent;
  let fixture: ComponentFixture<PreviewpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
