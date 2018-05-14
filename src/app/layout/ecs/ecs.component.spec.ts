import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcsComponent } from './ecs.component';

describe('EscComponent', () => {
  let component: EcsComponent;
  let fixture: ComponentFixture<EcsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
