import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewConsultantPage } from './view-consultant.page';

describe('ViewConsultantPage', () => {
  let component: ViewConsultantPage;
  let fixture: ComponentFixture<ViewConsultantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewConsultantPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewConsultantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
