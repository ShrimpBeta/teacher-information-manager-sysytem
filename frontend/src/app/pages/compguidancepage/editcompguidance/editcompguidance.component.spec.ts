import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcompguidanceComponent } from './editcompguidance.component';

describe('EditcompguidanceComponent', () => {
  let component: EditcompguidanceComponent;
  let fixture: ComponentFixture<EditcompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditcompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditcompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
