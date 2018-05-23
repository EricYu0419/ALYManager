import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardheadBtnModalComponent } from './cardhead-btn-modal.component';

describe('CardheadBtnModalComponent', () => {
  let component: CardheadBtnModalComponent;
  let fixture: ComponentFixture<CardheadBtnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardheadBtnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardheadBtnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
