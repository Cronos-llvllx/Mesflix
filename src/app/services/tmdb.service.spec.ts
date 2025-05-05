import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb.service';

describe('TmdbService', () => {
  let service: TmdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TmdbService);
  });

  it('deberia crear', () => {
    expect(service).toBeTruthy();
  });
});
