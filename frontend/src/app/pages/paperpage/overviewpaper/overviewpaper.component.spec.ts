import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewpaperComponent } from './overviewpaper.component';

describe('OverviewpaperComponent', () => {
  let component: OverviewpaperComponent;
  let fixture: ComponentFixture<OverviewpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewpaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
