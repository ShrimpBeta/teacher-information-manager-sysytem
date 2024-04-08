import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportsciresearchComponent } from './exportsciresearch.component';

describe('ExportsciresearchComponent', () => {
  let component: ExportsciresearchComponent;
  let fixture: ComponentFixture<ExportsciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportsciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportsciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
