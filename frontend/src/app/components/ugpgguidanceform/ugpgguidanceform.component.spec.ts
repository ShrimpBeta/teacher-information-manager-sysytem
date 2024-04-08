import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UgpgguidanceformComponent } from './ugpgguidanceform.component';

describe('UgpgguidanceformComponent', () => {
  let component: UgpgguidanceformComponent;
  let fixture: ComponentFixture<UgpgguidanceformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UgpgguidanceformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UgpgguidanceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
