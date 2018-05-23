import { TestBed, inject } from '@angular/core/testing';

import { ApifetchService } from './apifetch.service';

describe('ApifetchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApifetchService]
    });
  });

  it('should be created', inject([ApifetchService], (service: ApifetchService) => {
    expect(service).toBeTruthy();
  }));
});
