/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Usuario.client.changePassword.routedComponent } from './usuario.client.changePassword.routed.component';

describe('Usuario.client.changePassword.routedComponent', () => {
  let component: Usuario.client.changePassword.routedComponent;
  let fixture: ComponentFixture<Usuario.client.changePassword.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Usuario.client.changePassword.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Usuario.client.changePassword.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
