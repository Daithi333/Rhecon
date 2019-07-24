import { TestBed } from '@angular/core/testing';

import { AttachmentsService } from './attachments.service';

describe('AttachmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttachmentsService = TestBed.get(AttachmentsService);
    expect(service).toBeTruthy();
  });
});
