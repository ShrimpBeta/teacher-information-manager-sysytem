import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportcompguidanceComponent } from './exportcompguidance.component';

describe('ExportcompguidanceComponent', () => {
  let component: ExportcompguidanceComponent;
  let fixture: ComponentFixture<ExportcompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportcompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportcompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
