import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperformComponent } from './paperform.component';

describe('PaperformComponent', () => {
  let component: PaperformComponent;
  let fixture: ComponentFixture<PaperformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaperformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
