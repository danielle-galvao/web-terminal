import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendService } from 'src/app/backend.service';
import { map } from 'rxjs/operators';

/**
 * A component for rendering past commands and past commands' outputs
 */
@Component({
  selector: 'web-terminal-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnChanges {

  @Input() commandId;
  command$: Observable<any>;
  show = false;

  constructor(private backendService: BackendService) { }

  ngOnChanges(): void {
    this.command$ = this.backendService.getHistoryFor(this.commandId);
  }

  toggleOutput() {
    this.show = !this.show;
  }

}
