import { TestBed } from '@angular/core/testing';

import { OpenAiConnectionService } from './open-ai-connection.service';

describe('OpenAiConnectionService', () => {
  let service: OpenAiConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenAiConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
