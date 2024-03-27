import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdureformformComponent } from './edureformform.component';

describe('EdureformformComponent', () => {
  let component: EdureformformComponent;
  let fixture: ComponentFixture<EdureformformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdureformformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EdureformformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
