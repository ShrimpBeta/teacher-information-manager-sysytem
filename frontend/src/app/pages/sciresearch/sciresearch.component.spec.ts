import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SciresearchComponent } from './sciresearch.component';

describe('SciresearchComponent', () => {
  let component: SciresearchComponent;
  let fixture: ComponentFixture<SciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
