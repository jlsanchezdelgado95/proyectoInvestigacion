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

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {//Controlo que no entran en el main sin loguearse
    this.authService.logeado().subscribe(auth => {
      if (auth) {
        console.log("Logueado");
        this.authService.userData.subscribe(res => {
          this.email = res.email;
        })
      } else {
        console.log("No logueado");
        this.router.navigateByUrl('/login');
      }
    })
  }

  desconectarse() {
    this.authService.salirSesionService();
    this.email = undefined;
    this.router.navigateByUrl("/login");
  }

}
