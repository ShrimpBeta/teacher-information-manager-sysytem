import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmonographComponent } from './editmonograph.component';

describe('EditmonographComponent', () => {
  let component: EditmonographComponent;
  let fixture: ComponentFixture<EditmonographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditmonographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditmonographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
