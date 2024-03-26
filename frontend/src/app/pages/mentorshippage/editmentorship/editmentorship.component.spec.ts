import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmentorshipComponent } from './editmentorship.component';

describe('EditmentorshipComponent', () => {
  let component: EditmentorshipComponent;
  let fixture: ComponentFixture<EditmentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmentorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
