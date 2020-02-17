import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TerminalRoutingModule } from './terminal-routing.module';
import { TerminalPageComponent } from './terminal-page/terminal-page.component';
import { CommandLineComponent } from './command-line/command-line.component';
import { HistoryComponent } from './history/history.component';
import { HistoryOutputComponent } from './history-output/history-output.component';
import { HistoryCommandComponent } from './history-command/history-command.component';


@NgModule({
  declarations: [TerminalPageComponent, CommandLineComponent, HistoryComponent, HistoryOutputComponent, HistoryCommandComponent],
  imports: [
    CommonModule,
    TerminalRoutingModule
  ]
})
export class TerminalModule { }
