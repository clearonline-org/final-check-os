import { TestBed, async, inject } from '@angular/core/testing';

import { PrivateRouteGuard } from './private-route.guard';

describe('PrivateRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateRouteGuard]
    });
  });

  it('should ...', inject([PrivateRouteGuard], (guard: PrivateRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
