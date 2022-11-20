import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { ForoComponent } from './foro.component';

describe('ForoComponent', () => {
  let component: ForoComponent;
  let fixture: ComponentFixture<ForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForoComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule, TranslateModule.forRoot(), MatDialogModule ],
      providers: [TranslateService, TranslateStore  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
