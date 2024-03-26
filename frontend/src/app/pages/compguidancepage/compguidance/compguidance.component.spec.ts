import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompguidanceComponent } from './compguidance.component';

describe('CompguidanceComponent', () => {
  let component: CompguidanceComponent;
  let fixture: ComponentFixture<CompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
