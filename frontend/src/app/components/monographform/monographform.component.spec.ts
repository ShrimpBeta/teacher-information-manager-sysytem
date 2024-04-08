import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonographformComponent } from './monographform.component';

describe('MonographformComponent', () => {
  let component: MonographformComponent;
  let fixture: ComponentFixture<MonographformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonographformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonographformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
