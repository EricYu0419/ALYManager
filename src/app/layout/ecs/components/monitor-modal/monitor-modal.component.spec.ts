import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorModalComponent } from './monitor-modal.component';

describe('MonitorModalComponent', () => {
  let component: MonitorModalComponent;
  let fixture: ComponentFixture<MonitorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
