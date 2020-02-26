import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'web-terminal-man-page',
  templateUrl: './man-page.component.html',
  styleUrls: ['./man-page.component.scss']
})
export class ManPageComponent implements OnInit {

  constructor() { }

  ngOnInit():void {}

	@Input() x=0;
	@Input() y=0;
	@Input() command="";

	url = "http://man7.org/linux/man-pages/man1/ls.1.html";
	urls = {"ls": "http://man7.org/linux/man-pages/man1/ls.1.html","echo": "http://man7.org/linux/man-pages/man1/echo.1.html"};
	params = ""

	openWindow(){
		this.params = 'width=400,height=400,top='+this.y+',left='+this.x
		window.open(this.urls[this.command], 'man page', this.params);
	}

}
