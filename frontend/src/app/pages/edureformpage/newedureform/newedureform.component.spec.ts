import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewedureformComponent } from './newedureform.component';

describe('NewedureformComponent', () => {
  let component: NewedureformComponent;
  let fixture: ComponentFixture<NewedureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewedureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewedureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
