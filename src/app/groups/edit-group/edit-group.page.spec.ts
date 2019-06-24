import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupPage } from './edit-group.page';

describe('EditGroupPage', () => {
  let component: EditGroupPage;
  let fixture: ComponentFixture<EditGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
