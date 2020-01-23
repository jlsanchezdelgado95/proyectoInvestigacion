import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl } from '@angular/forms';

import { AuthenticationService } from 'src/app/login/authentication.service';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('');
  password = new FormControl('');
  closedRegis1 = true;
  closedRegis2 = true;
  closedRegis3 = true;

  closedLogin1 = true;
  closedLogin2 = true;
  closedLogin3 = true;

  constructor(private firebase: AngularFirestore, private authService: AuthenticationService,
    private router: Router) {
  }

  ngOnInit() {
  }

  acceder() {
    this.resetAlertsLogin();
    this.authService.accederService(this.email.value, this.password.value).then(res => {
      //console.log("Logueado");
      this.router.navigateByUrl("/main");
    })
      .catch(e => {
        console.log("Problemas con el acceso: ", e.message)
        if (e.message == "There is no user record corresponding to this identifier. The user may have been deleted") {
          this.closedLogin1 = false;
        } else if (e.message == "The password is invalid or the user does not have a password.") {
          this.closedLogin2 = false;
        } else if (e.message == "The email address is badly formatted.") {
          this.closedLogin3 = false;
        }
      });
  }

  resetAlertsLogin() {
    this.closedLogin1 = true;
    this.closedLogin2 = true;
    this.closedLogin3 = true;
  }

  registrarse() {
    this.resetAlertsRegis();
    this.authService.registarseService(this.email.value, this.password.value).then(res => {
      console.log("Registrado");
    })
      .catch(e => {
        console.log("No se ha podido registrar", e.message)
        if (e.message == "The email address is already in use by another account.") {
          this.closedRegis2 = false;
          //console.log("Se esta usando este correo electrónico");
        } else if (e.message == "The email address is badly formatted.") {
          this.closedRegis1 = false;
        } else if (e.message == "The password must be 6 characters long or more.") {
          this.closedRegis3 = false;
        }
      });
  }

  resetAlertsRegis() {
    this.closedRegis1 = true;
    this.closedRegis2 = true;
    this.closedRegis3 = true;
  }

}
