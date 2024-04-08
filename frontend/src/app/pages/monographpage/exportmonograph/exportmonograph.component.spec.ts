import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportmonographComponent } from './exportmonograph.component';

describe('ExportmonographComponent', () => {
  let component: ExportmonographComponent;
  let fixture: ComponentFixture<ExportmonographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportmonographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportmonographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
