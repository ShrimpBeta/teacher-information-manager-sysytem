import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmentorshipComponent } from './newmentorship.component';

describe('NewmentorshipComponent', () => {
  let component: NewmentorshipComponent;
  let fixture: ComponentFixture<NewmentorshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewmentorshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewmentorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
