import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'web-terminal-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() x=0;
  @Input() y=0;
  @Input() command="";
  @Input() endcommand="";

  addBreakpoint(){
  //  document.getElementById("showBreak").style.display = "block";
    document.getElementById("pipe-context-menu").style.display = "none";
  }

}
