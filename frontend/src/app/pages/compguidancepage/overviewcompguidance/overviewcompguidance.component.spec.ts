import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewcompguidanceComponent } from './overviewcompguidance.component';

describe('OverviewcompguidanceComponent', () => {
  let component: OverviewcompguidanceComponent;
  let fixture: ComponentFixture<OverviewcompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewcompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewcompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
