import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewmonographComponent } from './overviewmonograph.component';

describe('OverviewmonographComponent', () => {
  let component: OverviewmonographComponent;
  let fixture: ComponentFixture<OverviewmonographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewmonographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewmonographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
