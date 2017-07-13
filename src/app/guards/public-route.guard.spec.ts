import { TestBed, async, inject } from '@angular/core/testing';

import { PublicRouteGuard } from './public-route.guard';

describe('PublicRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicRouteGuard]
    });
  });

  it('should ...', inject([PublicRouteGuard], (guard: PublicRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
