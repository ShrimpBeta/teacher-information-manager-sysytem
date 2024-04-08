import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorshipformComponent } from './mentorshipform.component';

describe('MentorshipformComponent', () => {
  let component: MentorshipformComponent;
  let fixture: ComponentFixture<MentorshipformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorshipformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentorshipformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
