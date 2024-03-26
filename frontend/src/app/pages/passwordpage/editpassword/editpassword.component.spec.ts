import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpasswordComponent } from './editpassword.component';

describe('EditpasswordComponent', () => {
  let component: EditpasswordComponent;
  let fixture: ComponentFixture<EditpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditpasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
