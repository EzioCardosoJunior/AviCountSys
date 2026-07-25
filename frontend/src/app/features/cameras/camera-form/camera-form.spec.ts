import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraForm } from './camera-form';

describe('CameraForm', () => {
  let component: CameraForm;
  let fixture: ComponentFixture<CameraForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
