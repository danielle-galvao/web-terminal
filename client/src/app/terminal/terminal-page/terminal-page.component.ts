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
	contextmenu= false;
	contextmenuX= 0;
	contextmenuY= 0;
	contextmenuCommand = "";
	commandsSupported= ["ls", "echo"]

	//activates the context menu with the coordinates
	onRightClick(event){
		var textSelected = window.getSelection().toString().trim();
		if(this.commandsSupported.includes(textSelected)){
			this.contextmenuX=event.clientX;
			this.contextmenuY=event.clientY;
			this.contextmenu=true;
			this.contextmenuCommand=textSelected;
		}
	}

	//disables the menu
	disableContextMenu(){
		this.contextmenu=false;
	}

}
