import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewmentorshipComponent } from './overviewmentorship.component';

describe('OverviewmentorshipComponent', () => {
  let component: OverviewmentorshipComponent;
  let fixture: ComponentFixture<OverviewmentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewmentorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewmentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
