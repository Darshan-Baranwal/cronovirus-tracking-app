import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesDashboardComponent } from './states-dashboard.component';

describe('StatesDashboardComponent', () => {
  let component: StatesDashboardComponent;
  let fixture: ComponentFixture<StatesDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatesDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
