import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantsPage } from './consultants.page';

describe('ConsultantsPage', () => {
  let component: ConsultantsPage;
  let fixture: ComponentFixture<ConsultantsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
