import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewpaperComponent } from './newpaper.component';

describe('NewpaperComponent', () => {
  let component: NewpaperComponent;
  let fixture: ComponentFixture<NewpaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewpaperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewpaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
