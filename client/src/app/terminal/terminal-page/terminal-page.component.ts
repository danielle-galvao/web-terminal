import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/app/backend.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
    this.history$ = backend.getHistory().pipe(map(history => [...history.keys()]));
  }

  ngOnInit(): void {
  }

  commandId(command) {
    return command.clientId;
  }
	contextmenuMan= false;
  	contextmenuPipe= false;
	contextmenuX= 0;
	contextmenuY= 0;
	contextmenuCommand = "";
	commandsSupported= ["ls", "echo", "cat", "grep", "tar", "find", "awk", "diff", "sort", "wc",
"pwd", "cd", "mkdir", "mv", "rm", "cp"]
  endCommand = "";

	/**
	* On right click event, checks if highlighted text is a supported command. 
	* If so, activates the View Man Page context menu with the coordinates of the right click and selected command
	* @param event Right click event on terminal page
	**/
	onRightClick(event){
		var textSelected = window.getSelection().toString().trim();
		if(this.commandsSupported.includes(textSelected)){
			this.contextmenuX=event.clientX;
			this.contextmenuY=event.clientY;
			this.contextmenuMan=true;
			this.contextmenuCommand=textSelected;
		}
	}

	/**
	* On right click event IN COMMAND LINE, checks if highlighted text is a supported command. 
	* If so, activates the View Man Page context menu with the coordinates of the right click and selected command
	* If not, checks if highlighted text includes a pipeline. If so, activates the Add Pipeline Breakpoint context menu with the coordinates of the right click and the selected command pipeline
	* @param event Right click event in command line
	**/
  	onRightClickCommand(event){
    		var textSelected = window.getSelection().toString().trim();
    		if(this.commandsSupported.includes(textSelected)){
      			this.contextmenuX=event.clientX;
      			this.contextmenuY=event.clientY;
      			this.contextmenuMan=true;
     			 this.contextmenuCommand=textSelected;
    		}
    		else if(textSelected != "" && textSelected.charAt(textSelected.length-1) == "|"){
      			var splitCommand = textSelected.slice(0, -1);
      			this.contextmenuX=event.clientX;
      			this.contextmenuY=event.clientY;
      			this.contextmenuPipe=true;
      			this.contextmenuCommand=splitCommand
      			var fullCommand = (<HTMLInputElement>document.getElementById("command-line-input")).innerText;
      			var firstHalf = window.getSelection().toString().length;
      			var secondHalf = fullCommand.slice(firstHalf).trim();
      			this.endCommand=secondHalf;
      		//<span style="font-size: 8px; color: transparent;  text-shadow: 0 0 0 red; ">&#9899;</span> {{endcommand}} </div>
	    	// alert(this.contextmenuCommand);
		//alert((<HTMLInputElement>document.getElementById("commandId")).value);

    	}

  }

  addBreakpoint(){
    (<HTMLInputElement>document.getElementById("command-line-input")).innerText = this.contextmenuCommand + '⭕ ' + this.endCommand;
  }

	/**
	* Disables the context menu
	**/
	disableContextMenu(){
		this.contextmenuMan=false;
    		this.contextmenuPipe=false;
	}

}
