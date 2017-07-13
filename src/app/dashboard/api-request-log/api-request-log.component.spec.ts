import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiRequestLogComponent } from './api-request-log.component';

describe('ApiRequestLogComponent', () => {
  let component: ApiRequestLogComponent;
  let fixture: ComponentFixture<ApiRequestLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiRequestLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiRequestLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
