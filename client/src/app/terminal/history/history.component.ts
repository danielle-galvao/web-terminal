import { Component, OnInit, Input } from '@angular/core';

/**
 * A component for rendering past commands and past commands' outputs
 */
@Component({
  selector: 'web-terminal-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  @Input() command;
  show = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleOutput() {
    this.show = !this.show;
  }

}
