import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/backend.service';
import { Observable } from 'rxjs';

/**
 * This page is the actual 'terminal' the user opens after authenticating
 */
@Component({
  selector: 'web-terminal-terminal-page',
  templateUrl: './terminal-page.component.html',
  styleUrls: ['./terminal-page.component.scss']
})
export class TerminalPageComponent implements OnInit {
  history$: Observable<any[]>;

  constructor(private backend: BackendService) {
    this.history$ = backend.getHistory();
    this.history$.subscribe(console.log);
  }

  ngOnInit(): void {
  }

  commandId(command) {
    return command.id;
  }

}
