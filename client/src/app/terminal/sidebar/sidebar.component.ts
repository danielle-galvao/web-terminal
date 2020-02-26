import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'web-terminal-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
	var coll = document.getElementsByClassName("collapsible");
	var i;
	for(i=0; i < coll.length; i++){
		coll[i].addEventListener("click", function(){
			this.classList.toggle("active");
			var content = this.nextElementSibling;
			if (content.style.maxHeight){
				content.style.maxHeight = null;
			}
			else{
				content.style.maxHeight = content.scrollHeight + "px";
			}
		});
	}
  }


openNav(){
	document.getElementById("mySidebar").style.width = "250px";
	document.getElementById("closebtn").style.display = "block";
}

closeNav(){
document.getElementById("mySidebar").style.width = "0";
document.getElementById("closebtn").style.display = "none";
}

}
