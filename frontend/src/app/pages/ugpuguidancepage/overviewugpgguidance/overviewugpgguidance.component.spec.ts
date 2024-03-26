import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewugpgguidanceComponent } from './overviewugpgguidance.component';

describe('OverviewugpgguidanceComponent', () => {
  let component: OverviewugpgguidanceComponent;
  let fixture: ComponentFixture<OverviewugpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewugpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewugpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
