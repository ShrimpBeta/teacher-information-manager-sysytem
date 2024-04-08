import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportmentorshipComponent } from './exportmentorship.component';

describe('ExportmentorshipComponent', () => {
  let component: ExportmentorshipComponent;
  let fixture: ComponentFixture<ExportmentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportmentorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportmentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
