import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsciresearchComponent } from './editsciresearch.component';

describe('EditsciresearchComponent', () => {
  let component: EditsciresearchComponent;
  let fixture: ComponentFixture<EditsciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditsciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditsciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
