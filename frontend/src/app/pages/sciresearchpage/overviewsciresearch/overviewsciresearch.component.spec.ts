import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewsciresearchComponent } from './overviewsciresearch.component';

describe('OverviewsciresearchComponent', () => {
  let component: OverviewsciresearchComponent;
  let fixture: ComponentFixture<OverviewsciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewsciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewsciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
