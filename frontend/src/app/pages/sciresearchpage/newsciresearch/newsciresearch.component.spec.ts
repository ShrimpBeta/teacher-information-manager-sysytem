import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsciresearchComponent } from './newsciresearch.component';

describe('NewsciresearchComponent', () => {
  let component: NewsciresearchComponent;
  let fixture: ComponentFixture<NewsciresearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsciresearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewsciresearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
