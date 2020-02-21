import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { AuthenticationGuard } from './authentication.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AuthPageComponent
  },
  {
    path: 'terminal',
    loadChildren: () => import('./terminal/terminal.module').then((module) => module.TerminalModule),
    canLoad: [ AuthenticationGuard ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
