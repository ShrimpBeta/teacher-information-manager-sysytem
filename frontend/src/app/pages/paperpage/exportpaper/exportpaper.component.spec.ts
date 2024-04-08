import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportpaperComponent } from './exportpaper.component';

describe('ExportpaperComponent', () => {
  let component: ExportpaperComponent;
  let fixture: ComponentFixture<ExportpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportpaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
