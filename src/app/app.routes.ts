import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';  // Importa LocationStrategy y PathLocationStrategy

import { MenuRoutedComponent } from './components/shared/menu.routed/menu.routed.component';

import { UsuarioAdminCreateRoutedComponent } from './components/usuario/admin/usuario.admin.create.routed/usuario.admin.create.routed.component';
import { UsuarioAdminEditRoutedComponent } from './components/usuario/admin/usuario.admin.edit.routed/usuario.admin.edit.routed.component';
import { UsuarioAdminPlistRoutedComponent } from './components/usuario/admin/usuario.admin.plist.routed/usuario.admin.plist.routed.component';
import { UsuarioAdminViewRoutedComponent } from './components/usuario/admin/usuario.admin.view.routed/usuario.admin.view.routed.component';
import { UsuarioAdminDeleteRoutedComponent } from './components/usuario/admin/usuario.admin.delete.routed/usuario.admin.delete.routed.component';
import { UsuarioClientCreateRoutedComponent } from './components/usuario/client/usuario.client.create.routed/usuario.client.create.routed.component';
import { UsuarioClientEditRoutedComponent } from './components/usuario/client/usuario.client.edit.routed/usuario.client.edit.routed.component';
import { UsuarioClientPlistRoutedComponent } from './components/usuario/client/usuario.client.plist.routed/usuario.client.plist.routed.component';
import { UsuarioClientViewRoutedComponent } from './components/usuario/client/usuario.client.view.routed/usuario.client.view.routed.component';
import { UsuarioClientDeleteRoutedComponent } from './components/usuario/client/usuario.client.delete.routed/usuario.client.delete.routed.component';

import { ProductoClientPlistRoutedComponent } from './components/producto/client/producto.client.plist.routed/producto.client.plist.routed.component';
import { BrowserModule } from '@angular/platform-browser';

export const routes: Routes = [

    { path: '', redirectTo: '/shared/menu', pathMatch: 'full' }, 

    {path: 'shared/menu', component: MenuRoutedComponent},


    {path: 'usuario/admin/create', component: UsuarioAdminCreateRoutedComponent},
    {path: 'usuario/admin/edit', component: UsuarioAdminEditRoutedComponent},
    {path: 'usuario/admin/plist', component: UsuarioAdminPlistRoutedComponent},
    {path: 'usuario/admin/view', component: UsuarioAdminViewRoutedComponent},
    {path: 'usuario/admin/delete', component: UsuarioAdminDeleteRoutedComponent},

    {path: 'usuario/client/create', component: UsuarioClientCreateRoutedComponent},
    {path: 'usuario/client/edit', component: UsuarioClientEditRoutedComponent},
    {path: 'usuario/client/plist', component: UsuarioClientPlistRoutedComponent},
    {path: 'usuario/client/view', component: UsuarioClientViewRoutedComponent},
    {path: 'usuario/client/delete', component: UsuarioClientDeleteRoutedComponent},


    {path: 'producto/client/plist', component: ProductoClientPlistRoutedComponent},


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

