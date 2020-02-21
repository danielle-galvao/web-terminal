import { Component, OnInit, Input } from '@angular/core';

/**
 * A component for rendering previous commands that were run
 */
@Component({
  selector: 'web-terminal-history-command',
  templateUrl: './history-command.component.html',
  styleUrls: ['./history-command.component.scss']
})
export class HistoryCommandComponent implements OnInit {

  @Input() command;

  constructor() { }

  ngOnInit(): void {
  }

}
