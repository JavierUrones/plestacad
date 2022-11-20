import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

import { ManageWorkComponent } from './manage-work.component';

describe('ManageWorkComponent', () => {
  let component: ManageWorkComponent;
  let fixture: ComponentFixture<ManageWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWorkComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule,      TranslateModule.forRoot() ],
      providers: [TranslateService, TranslateStore  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
