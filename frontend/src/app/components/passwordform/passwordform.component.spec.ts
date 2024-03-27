import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordformComponent } from './passwordform.component';

describe('PasswordformComponent', () => {
  let component: PasswordformComponent;
  let fixture: ComponentFixture<PasswordformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PasswordformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
