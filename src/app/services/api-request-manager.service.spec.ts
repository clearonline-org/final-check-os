import { TestBed, inject } from '@angular/core/testing';

import { ApiRequestManagerService } from './api-request-manager.service';

describe('ApiRequestManagerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ApiRequestManagerService],
		});
	});

	it(
		'should ...',
		inject([ApiRequestManagerService], (service: ApiRequestManagerService) => {
			expect(service).toBeTruthy();
		})
	);
});
