import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceModalComponent } from './instance-modal.component';

describe('InstanceModalComponent', () => {
  let component: InstanceModalComponent;
  let fixture: ComponentFixture<InstanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
