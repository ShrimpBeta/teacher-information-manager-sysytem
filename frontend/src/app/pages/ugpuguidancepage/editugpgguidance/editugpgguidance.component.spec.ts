import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditugpgguidanceComponent } from './editugpgguidance.component';

describe('EditugpgguidanceComponent', () => {
  let component: EditugpgguidanceComponent;
  let fixture: ComponentFixture<EditugpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditugpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditugpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
