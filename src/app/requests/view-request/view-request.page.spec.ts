import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRequestPage } from './view-request.page';

describe('ViewRequestPage', () => {
  let component: ViewRequestPage;
  let fixture: ComponentFixture<ViewRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
