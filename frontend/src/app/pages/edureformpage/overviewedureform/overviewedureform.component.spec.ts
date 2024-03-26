import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewedureformComponent } from './overviewedureform.component';

describe('OverviewedureformComponent', () => {
  let component: OverviewedureformComponent;
  let fixture: ComponentFixture<OverviewedureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewedureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewedureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
