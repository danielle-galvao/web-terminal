import { Component, OnInit, Input } from '@angular/core';

/**
 * A component for rendering output of previous commands
 */
@Component({
  selector: 'web-terminal-history-output',
  templateUrl: './history-output.component.html',
  styleUrls: ['./history-output.component.scss']
})
export class HistoryOutputComponent implements OnInit {

  @Input() output;

  constructor() { }

  ngOnInit(): void {
  }

}
