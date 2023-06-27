import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioRecorderPopupComponent } from './audio-recorder-popup.component';

describe('AudioRecorderPopupComponent', () => {
  let component: AudioRecorderPopupComponent;
  let fixture: ComponentFixture<AudioRecorderPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioRecorderPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioRecorderPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
