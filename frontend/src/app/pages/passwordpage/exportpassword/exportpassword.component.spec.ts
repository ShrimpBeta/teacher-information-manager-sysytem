import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportpasswordComponent } from './exportpassword.component';

describe('ExportpasswordComponent', () => {
  let component: ExportpasswordComponent;
  let fixture: ComponentFixture<ExportpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
