import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPatientPage } from './new-patient.page';

describe('NewPatientPage', () => {
  let component: NewPatientPage;
  let fixture: ComponentFixture<NewPatientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPatientPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
