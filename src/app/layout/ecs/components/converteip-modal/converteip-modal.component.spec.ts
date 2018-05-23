import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverteipModalComponent } from './converteip-modal.component';

describe('ConverteipModalComponent', () => {
  let component: ConverteipModalComponent;
  let fixture: ComponentFixture<ConverteipModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConverteipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConverteipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
