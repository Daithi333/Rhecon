import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientPage } from './edit-patient.page';

describe('EditPatientPage', () => {
  let component: EditPatientPage;
  let fixture: ComponentFixture<EditPatientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatientPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
