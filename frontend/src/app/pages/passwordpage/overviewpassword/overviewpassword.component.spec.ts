import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewpasswordComponent } from './overviewpassword.component';

describe('OverviewpasswordComponent', () => {
  let component: OverviewpasswordComponent;
  let fixture: ComponentFixture<OverviewpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
