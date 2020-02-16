import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  @ViewChild('token') token;
  @ViewChild('error') error;

  constructor(private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
  }

  clicked(){
    //TODO need to clean up subscription?
    this.backend.authenticate(this.token.nativeElement.value).subscribe((didSucceed) => {
      if(didSucceed) {
        this.router.navigateByUrl('terminal');
      } else {
        this.error.nativeElement.innerHTML = 'Failed to authenticate';
      }
    }, (err) => {
      this.error.nativeElement.innerHTML = 'Failed to authenticate ' + err;
    })
  }

}
