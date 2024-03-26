import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditedureformComponent } from './editedureform.component';

describe('EditedureformComponent', () => {
  let component: EditedureformComponent;
  let fixture: ComponentFixture<EditedureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditedureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditedureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
