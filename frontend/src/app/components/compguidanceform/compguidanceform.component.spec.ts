import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompguidanceformComponent } from './compguidanceform.component';

describe('CompguidanceformComponent', () => {
  let component: CompguidanceformComponent;
  let fixture: ComponentFixture<CompguidanceformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompguidanceformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompguidanceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
