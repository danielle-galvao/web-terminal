import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'web-terminal-command-line',
  templateUrl: './command-line.component.html',
  styleUrls: ['./command-line.component.scss']
})
export class CommandLineComponent implements OnInit {

  @ViewChild('input') command;

  constructor(private backend: BackendService) { }

  ngOnInit(): void {
  }

  sendCommand() {
    this.backend.sendCommand(this.command.nativeElement.value);
    // TODO handle observable
    return false;
  }
}
