/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Producto.admin.edit.routedComponent } from './producto.admin.edit.routed.component';

describe('Producto.admin.edit.routedComponent', () => {
  let component: Producto.admin.edit.routedComponent;
  let fixture: ComponentFixture<Producto.admin.edit.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Producto.admin.edit.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Producto.admin.edit.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
