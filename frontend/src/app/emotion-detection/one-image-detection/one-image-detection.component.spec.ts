import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneImageDetectionComponent } from './one-image-detection.component';

describe('OneImageDetectionComponent', () => {
  let component: OneImageDetectionComponent;
  let fixture: ComponentFixture<OneImageDetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneImageDetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OneImageDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
