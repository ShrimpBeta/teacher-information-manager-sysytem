import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewmonographComponent } from './newmonograph.component';

describe('NewmonographComponent', () => {
  let component: NewmonographComponent;
  let fixture: ComponentFixture<NewmonographComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewmonographComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewmonographComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
