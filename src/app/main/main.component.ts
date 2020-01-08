import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/login/authentication.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  email;

  constructor(private auth: AuthenticationService, private router: Router) { }

  ngOnInit() {//Controlo que no entran en el main sin loguearse
    this.auth.userData.subscribe(res => {
      this.email = res.email;
      console.log(this.email);
      if (this.email == null || this.email == undefined) {
        this.router.navigateByUrl("/login");
      }
    });
  }

}
