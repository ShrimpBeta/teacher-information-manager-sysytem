import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewedureformComponent } from './previewedureform.component';

describe('PreviewedureformComponent', () => {
  let component: PreviewedureformComponent;
  let fixture: ComponentFixture<PreviewedureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewedureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewedureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
