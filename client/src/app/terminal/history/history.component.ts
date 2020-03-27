import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { BackendService } from 'src/app/backend.service';
import { map, filter, takeWhile, takeUntil, last, tap } from 'rxjs/operators';
import { KeybindService, KeybindValue } from '../keybind.service';

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

  constructor(private backendService: BackendService, private keybindService: KeybindService) {
  }

  ngOnChanges(): void {
    this.command$ = this.backendService.getHistoryFor(this.commandId);
    fromEvent(document, 'keydown').pipe(
      takeUntil(this.command$.pipe(last())),
      filter(this.keybindService.getKeybindingFilter(KeybindValue.CTRL_C)),
    ).subscribe(_ => this.backendService.signalCommand(this.commandId, 15));
  }

  toggleOutput() {
    this.show = !this.show;
  }

}
