import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalRoutingModule } from './terminal-routing.module';
import { TerminalPageComponent } from './terminal-page/terminal-page.component';


@NgModule({
  declarations: [TerminalPageComponent],
  imports: [
    CommonModule,
    TerminalRoutingModule
  ]
})
export class TerminalModule { }
