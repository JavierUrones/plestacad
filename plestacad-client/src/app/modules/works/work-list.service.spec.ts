import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { WorkService } from '../../shared/services/work.service';

describe('WorkService', () => {
  let service: WorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule,      TranslateModule.forRoot() ],
      providers: [TranslateService, TranslateStore  ]});
    service = TestBed.inject(WorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
