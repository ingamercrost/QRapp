import { TestBed } from '@angular/core/testing';

import { SasistenciaService } from './sasistencia.service';

describe('SasistenciaService', () => {
  let service: SasistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SasistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
