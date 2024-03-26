import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewugpgguidanceComponent } from './newugpgguidance.component';

describe('NewugpgguidanceComponent', () => {
  let component: NewugpgguidanceComponent;
  let fixture: ComponentFixture<NewugpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewugpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewugpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
