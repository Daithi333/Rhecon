import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContactPage } from './view-contact.page';

describe('ViewContactPage', () => {
  let component: ViewContactPage;
  let fixture: ComponentFixture<ViewContactPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContactPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
