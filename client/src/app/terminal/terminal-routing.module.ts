import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TerminalPageComponent } from './terminal-page/terminal-page.component';


const routes: Routes = [
  {
    path: '**',
    component: TerminalPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerminalRoutingModule { }
