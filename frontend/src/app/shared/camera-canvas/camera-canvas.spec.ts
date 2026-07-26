import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraCanvas } from './camera-canvas';

describe('CameraCanvas', () => {
  let component: CameraCanvas;
  let fixture: ComponentFixture<CameraCanvas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraCanvas],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraCanvas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
