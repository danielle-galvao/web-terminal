import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'web-terminal-command-line',
  templateUrl: './command-line.component.html',
  styleUrls: ['./command-line.component.scss']
})
export class CommandLineComponent implements AfterViewInit {

  @ViewChild('input') command: ElementRef<HTMLSpanElement>;

  constructor(private backend: BackendService) { }

  ngAfterViewInit(): void {
    this.command.nativeElement.addEventListener('keydown', (e) => {
      if(e.keyCode == 13 && !e.shiftKey) {
        e.preventDefault();
        this.sendCommand();
      }
    });
    this.command.nativeElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  sendCommand() {
    this.backend.sendCommand(this.command.nativeElement.innerText);
    this.command.nativeElement.innerText = '';
    // TODO handle observable
    return false;
  }
}
