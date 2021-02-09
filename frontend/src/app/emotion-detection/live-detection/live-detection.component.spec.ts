import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDetectionComponent } from './live-detection.component';

describe('LiveDetectionComponent', () => {
  let component: LiveDetectionComponent;
  let fixture: ComponentFixture<LiveDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
