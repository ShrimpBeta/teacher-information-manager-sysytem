import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgpgguidanceComponent } from './ugpgguidance.component';

describe('UgpgguidanceComponent', () => {
  let component: UgpgguidanceComponent;
  let fixture: ComponentFixture<UgpgguidanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgpgguidanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UgpgguidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
