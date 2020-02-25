import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

/**
 * This page is the first shown to the user, where they enter the token they were shown in the console
 */
@Component({
  selector: 'web-terminal-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {

  @ViewChild('token') token;
  @ViewChild('error') error;

  constructor(private title: Title, private backend: BackendService, private router: Router) { }

  ngOnInit(): void {
    this.title.setTitle('Authentication Page');
  }

  /**
   * When the user submits the form, it goes through this method which uses the backend service to authenticate, redirecting if successful,
   * otherwise writing to the error element in the form
   */
  authenticate(){
    //TODO need to clean up subscription?
    this.backend.authenticate(this.token.nativeElement.value).subscribe((didSucceed) => {
      if(didSucceed) {
        this.router.navigateByUrl('terminal').then(console.log);
      } else {
        this.error.nativeElement.innerHTML = 'Failed to authenticate';
      }
    }, (err) => {
      this.error.nativeElement.innerHTML = 'Failed to authenticate: "' + err.message + '"';
    });
    return false; //prevent form default behavior
  }

}
