import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdureformComponent } from './edureform.component';

describe('EdureformComponent', () => {
  let component: EdureformComponent;
  let fixture: ComponentFixture<EdureformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdureformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
