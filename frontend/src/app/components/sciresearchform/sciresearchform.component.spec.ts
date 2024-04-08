import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SciresearchformComponent } from './sciresearchform.component';

describe('SciresearchformComponent', () => {
  let component: SciresearchformComponent;
  let fixture: ComponentFixture<SciresearchformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SciresearchformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SciresearchformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
