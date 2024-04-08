import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportedureformComponent } from './exportedureform.component';

describe('ExportedureformComponent', () => {
  let component: ExportedureformComponent;
  let fixture: ComponentFixture<ExportedureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportedureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportedureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
