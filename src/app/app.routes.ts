import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';  // Importa LocationStrategy y PathLocationStrategy
import { BrowserModule } from '@angular/platform-browser';

import { AdminGuard } from './guards/admin.guard';
import { AdminOrClientGuard } from './guards/adminorclient.guard';
import { ClientGuard } from './guards/client.guard';

import { MenuRoutedComponent } from './components/shared/menu.routed/menu.routed.component';
import { LoginRoutedComponent } from './components/shared/login.routed/login.routed.component';
import { LogoutRoutedComponent } from './components/shared/logout.routed/logout.routed.component';
import { AboutmeRoutedComponent } from './components/shared/aboutme.routed/aboutme.routed.component';


import { UsuarioAdminCreateRoutedComponent } from './components/usuario/admin/usuario.admin.create.routed/usuario.admin.create.routed.component';
import { UsuarioAdminEditRoutedComponent } from './components/usuario/admin/usuario.admin.edit.routed/usuario.admin.edit.routed.component';
import { UsuarioAdminPlistRoutedComponent } from './components/usuario/admin/usuario.admin.plist.routed/usuario.admin.plist.routed.component';
import { UsuarioAdminViewRoutedComponent } from './components/usuario/admin/usuario.admin.view.routed/usuario.admin.view.routed.component';
import { UsuarioAdminDeleteRoutedComponent } from './components/usuario/admin/usuario.admin.delete.routed/usuario.admin.delete.routed.component';

import { UsuarioClientViewRoutedComponent } from './components/usuario/client/usuario.client.view.routed/usuario.client.view.routed.component';
import { UsuarioClientCreateRoutedComponent } from './components/usuario/client/usuario.client.create.routed/usuario.client.create.routed.component';
import { UsuarioClientEditRoutedComponent } from './components/usuario/client/usuario.client.edit.routed/usuario.client.edit.routed.component';


import { ProductoAdminCreateRoutedComponent } from './components/producto/admin/producto.admin.create.routed/producto.admin.create.routed.component';
import { ProductoAdminEditRoutedComponent } from './components/producto/admin/producto.admin.edit.routed/producto.admin.edit.routed.component';
import { ProductoAdminPlistRoutedComponent } from './components/producto/admin/producto.admin.plist.routed/producto.admin.plist.routed.component';
import { ProductoAdminDeleteRoutedComponent } from './components/producto/admin/producto.admin.delete.routed/producto.admin.delete.routed.component';
import { ProductoAdminViewRoutedComponent } from './components/producto/admin/producto.admin.view.routed/producto.admin.view.routed.component';

import { ProductoClientPlistRoutedComponent } from './components/producto/client/producto.client.plist.routed/producto.client.plist.routed.component';
import { ProductoClientViewRoutedComponent } from './components/producto/client/producto.client.view.routed/producto.client.view.routed.component';


import { ComisionClientBookRoutedComponent } from './components/producto/client/comision.client.book.routed/comision.client.book.routed.component';

import { CompraClientComprarRoutedComponent } from './components/compra/compra.client.comprar.routed/compra.client.comprar.routed.component';


import { TipousuarioAdminCreateRoutedComponent } from './components/tipousuario/tipousuario.admin.create.routed/tipousuario.admin.create.routed.component';
import { TipousuarioAdminEditRoutedComponent } from './components/tipousuario/tipousuario.admin.edit.routed/tipousuario.admin.edit.routed.component';
import { TipousuarioAdminPlistRoutedComponent } from './components/tipousuario/tipousuario.admin.plist.routed/tipousuario.admin.plist.routed.component';
import { TipousuarioAdminDeleteRoutedComponent } from './components/tipousuario/tipousuario.admin.delete.routed/tipousuario.admin.delete.routed.component';
import { TipousuarioAdminViewRoutedComponent } from './components/tipousuario/tipousuario.admin.view.routed/tipousuario.admin.view.routed.component';


export const routes: Routes = [

    { path: '', redirectTo: '/shared/menu', pathMatch: 'full'}, 
    {path: 'shared/menu', component: MenuRoutedComponent },

    {path: 'login', component: LoginRoutedComponent},
    {path: 'logout', component: LogoutRoutedComponent},
    {path: 'aboutme', component: AboutmeRoutedComponent},


    {path: 'usuario/admin/create', component: UsuarioAdminCreateRoutedComponent, canActivate: [AdminGuard]},
    {path: 'usuario/admin/edit/:id', component: UsuarioAdminEditRoutedComponent, canActivate: [AdminGuard]},
    {path: 'usuario/admin/plist', component: UsuarioAdminPlistRoutedComponent, canActivate: [AdminGuard]},
    {path: 'usuario/admin/view/:id', component: UsuarioAdminViewRoutedComponent, canActivate: [AdminGuard]},
    {path: 'usuario/admin/delete/:id', component: UsuarioAdminDeleteRoutedComponent, canActivate: [AdminGuard]},

    {path: 'usuario/client/view/:id', component: UsuarioClientViewRoutedComponent, canActivate: [AdminOrClientGuard]},
    {path: 'usuario/client/create', component: UsuarioClientCreateRoutedComponent},
    {path: 'usuario/client/edit/:id', component: UsuarioClientEditRoutedComponent, canActivate: [AdminOrClientGuard]},

    
    {path: 'producto/admin/create', component: ProductoAdminCreateRoutedComponent, canActivate: [AdminGuard]},
    {path: 'producto/admin/edit/:id', component: ProductoAdminEditRoutedComponent, canActivate: [AdminGuard]},
    {path: 'producto/admin/plist', component: ProductoAdminPlistRoutedComponent, canActivate: [AdminGuard]},
    {path: 'producto/admin/delete/:id', component: ProductoAdminDeleteRoutedComponent, canActivate: [AdminGuard]},
    {path: 'producto/admin/view/:id', component: ProductoAdminViewRoutedComponent, canActivate: [AdminGuard]},

    {path: 'producto/client/plist', component: ProductoClientPlistRoutedComponent, canActivate: [AdminOrClientGuard]},
    {path: 'producto/client/view/:id', component: ProductoClientViewRoutedComponent, canActivate: [AdminOrClientGuard]},


    {path: 'tipousuario/admin/create', component: TipousuarioAdminCreateRoutedComponent, canActivate: [AdminGuard]},
    {path: 'tipousuario/admin/edit/:id', component: TipousuarioAdminEditRoutedComponent, canActivate: [AdminGuard]},
    {path: 'tipousuario/admin/plist', component: TipousuarioAdminPlistRoutedComponent, canActivate: [AdminGuard]},
    {path: 'tipousuario/admin/delete/:id', component: TipousuarioAdminDeleteRoutedComponent, canActivate: [AdminGuard]},
    {path: 'tipousuario/admin/view/:id', component: TipousuarioAdminViewRoutedComponent, canActivate: [AdminGuard]},


    {path: 'comision/client/book', component: ComisionClientBookRoutedComponent, canActivate: [AdminOrClientGuard]},


    {path: 'comprar/:id', component: CompraClientComprarRoutedComponent},


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

