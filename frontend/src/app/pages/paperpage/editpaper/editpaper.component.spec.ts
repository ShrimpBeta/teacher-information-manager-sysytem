import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditpaperComponent } from './editpaper.component';

describe('EditpaperComponent', () => {
  let component: EditpaperComponent;
  let fixture: ComponentFixture<EditpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditpaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
