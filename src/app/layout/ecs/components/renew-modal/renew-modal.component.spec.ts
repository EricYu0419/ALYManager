import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewModalComponent } from './renew-modal.component';

describe('RenewModalComponent', () => {
  let component: RenewModalComponent;
  let fixture: ComponentFixture<RenewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
