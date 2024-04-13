import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateclassscheduledialogComponent } from './createclassscheduledialog.component';

describe('CreateclassscheduledialogComponent', () => {
  let component: CreateclassscheduledialogComponent;
  let fixture: ComponentFixture<CreateclassscheduledialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateclassscheduledialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateclassscheduledialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
