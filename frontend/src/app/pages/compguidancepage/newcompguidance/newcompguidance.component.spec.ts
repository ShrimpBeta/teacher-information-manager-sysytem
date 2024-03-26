import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcompguidanceComponent } from './newcompguidance.component';

describe('NewcompguidanceComponent', () => {
  let component: NewcompguidanceComponent;
  let fixture: ComponentFixture<NewcompguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewcompguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewcompguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
