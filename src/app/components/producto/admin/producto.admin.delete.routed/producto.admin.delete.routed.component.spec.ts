/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Producto.admin.delete.routedComponent } from './producto.admin.delete.routed.component';

describe('Producto.admin.delete.routedComponent', () => {
  let component: Producto.admin.delete.routedComponent;
  let fixture: ComponentFixture<Producto.admin.delete.routedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Producto.admin.delete.routedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Producto.admin.delete.routedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
