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

	/**
	* Dictionary of commands and  associated man page "urls"
	*/
	urls = {"ls": "http://man7.org/linux/man-pages/man1/ls.1.html","echo": "http://man7.org/linux/man-pages/man1/echo.1.html",
		"cat": "http://man7.org/linux/man-pages/man1/cat.1.html", "grep": "http://man7.org/linux/man-pages/man1/grep.1.html",  "tar": "http://man7.org/linux/man-pages/man1/tar.1.html", 
		"find": "http://man7.org/linux/man-pages/man1/find.1.html", "awk":  "http://man7.org/linux/man-pages/man1/awk.1p.html", "diff": "http://man7.org/linux/man-pages/man1/diff.1.html",
		"sort": "http://man7.org/linux/man-pages/man1/sort.1.html", "wc": "http://man7.org/linux/man-pages/man1/wc.1.html", "pwd": "http://man7.org/linux/man-pages/man1/pwd.1.html", "cd": "http://man7.org/linux/man-pages/man1/cd.1p.html", "mkdir": "http://man7.org/linux/man-pages/man1/mkdir.1.html", "mv": "http://man7.org/linux/man-pages/man1/mv.1.html", 
		"rm": "http://man7.org/linux/man-pages/man1/rm.1.html", "cp": "http://man7.org/linux/man-pages/man1/cp.1.html"};

	/**
	* Will contain initial "params": width, height, and location (top, left) for pop up window
	*/
	params = ""


	/**
	* Opens window with link to man page for command
	*/
	openWindow(){
		this.params = 'width=400,height=400,top='+this.y+',left='+this.x
		window.open(this.urls[this.command], 'man page', this.params);
	}

}
