import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';  // Importa LocationStrategy y PathLocationStrategy
import { BrowserModule } from '@angular/platform-browser';

import { MenuRoutedComponent } from './components/shared/menu.routed/menu.routed.component';
import { LoginRoutedComponent } from './components/shared/login.routed/login.routed.component';

import { UsuarioAdminCreateRoutedComponent } from './components/usuario/admin/usuario.admin.create.routed/usuario.admin.create.routed.component';
import { UsuarioAdminEditRoutedComponent } from './components/usuario/admin/usuario.admin.edit.routed/usuario.admin.edit.routed.component';
import { UsuarioAdminPlistRoutedComponent } from './components/usuario/admin/usuario.admin.plist.routed/usuario.admin.plist.routed.component';
import { UsuarioAdminViewRoutedComponent } from './components/usuario/admin/usuario.admin.view.routed/usuario.admin.view.routed.component';
import { UsuarioAdminDeleteRoutedComponent } from './components/usuario/admin/usuario.admin.delete.routed/usuario.admin.delete.routed.component';

import { UsuarioClientViewRoutedComponent } from './components/usuario/client/usuario.client.view.routed/usuario.client.view.routed.component';


import { ProductoAdminCreateRoutedComponent } from './components/producto/admin/producto.admin.create.routed/producto.admin.create.routed.component';
import { ProductoAdminEditRoutedComponent } from './components/producto/admin/producto.admin.edit.routed/producto.admin.edit.routed.component';
import { ProductoAdminPlistRoutedComponent } from './components/producto/admin/producto.admin.plist.routed/producto.admin.plist.routed.component';
import { ProductoAdminDeleteRoutedComponent } from './components/producto/admin/producto.admin.delete.routed/producto.admin.delete.routed.component';

import { ProductoClientPlistRoutedComponent } from './components/producto/client/producto.client.plist.routed/producto.client.plist.routed.component';

import { ComisionClientBookRoutedComponent } from './components/producto/client/comision.client.book.routed/comision.client.book.routed.component';
import { ProductoAdminViewRoutedComponent } from './components/producto/admin/producto.admin.view.routed/producto.admin.view.routed.component';
import { ProductoClientViewRoutedComponent } from './components/producto/client/producto.client.view.routed/producto.client.view.routed.component';


export const routes: Routes = [

    { path: '', redirectTo: '/shared/menu', pathMatch: 'full' }, 
    {path: 'shared/menu', component: MenuRoutedComponent},

    {path: 'login', component: LoginRoutedComponent},


    {path: 'usuario/admin/create', component: UsuarioAdminCreateRoutedComponent},
    {path: 'usuario/admin/edit/:id', component: UsuarioAdminEditRoutedComponent},
    {path: 'usuario/admin/plist', component: UsuarioAdminPlistRoutedComponent},
    {path: 'usuario/admin/view/:id', component: UsuarioAdminViewRoutedComponent},
    {path: 'usuario/admin/delete/:id', component: UsuarioAdminDeleteRoutedComponent},


    {path: 'usuario/client/view/:id', component: UsuarioClientViewRoutedComponent},

    
    {path: 'producto/admin/create', component: ProductoAdminCreateRoutedComponent},
    {path: 'producto/admin/edit/:id', component: ProductoAdminEditRoutedComponent},
    {path: 'producto/admin/plist', component: ProductoAdminPlistRoutedComponent},
    {path: 'producto/admin/delete/:id', component: ProductoAdminDeleteRoutedComponent},
    {path: 'producto/admin/view/:id', component: ProductoAdminViewRoutedComponent},

    {path: 'producto/client/plist', component: ProductoClientPlistRoutedComponent},
    {path: 'producto/client/view/:id', component: ProductoClientViewRoutedComponent},


    {path: 'comision/client/book', component: ComisionClientBookRoutedComponent},

    //{path: '', component:},

];

@NgModule({

    imports: [RouterModule.forRoot(routes), BrowserModule],
    exports: [RouterModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy }  // Establece la estrategia de ubicación
      ]
  })
  export class AppRoutingModule {}

