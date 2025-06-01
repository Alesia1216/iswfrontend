/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Footer.unroutedComponent } from './footer.unrouted.component';

describe('Footer.unroutedComponent', () => {
  let component: Footer.unroutedComponent;
  let fixture: ComponentFixture<Footer.unroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Footer.unroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Footer.unroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
