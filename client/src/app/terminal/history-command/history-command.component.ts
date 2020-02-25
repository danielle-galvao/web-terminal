import { Component, OnInit, Input, ElementRef } from '@angular/core';

/**
 * A component for rendering previous commands that were run
 */
@Component({
  selector: 'web-terminal-history-command',
  templateUrl: './history-command.component.html',
  styleUrls: ['./history-command.component.scss']
})
export class HistoryCommandComponent implements OnInit {

  @Input() command: string;

  constructor() { }

  ngOnInit(): void {
  }
  
  copy() {
    window.navigator.clipboard.writeText(this.command);
  }

}
