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

  constructor(private firebase: AngularFirestore, private authService: AuthenticationService
    , private router: Router) {
  }

  ngOnInit() {
  }

  acceder() {
    this.authService.accederService(this.email.value, this.password.value).then(res => {
      //console.log("Logueado");
      this.router.navigateByUrl("/main");
    })
      .catch(e => {
        console.log("Problemas con el acceso: ", e.message)
      });
  }

  registrarse() {
    this.authService.registarseService(this.email.value, this.password.value).then(res => {
      console.log("Registrado");
    })
      .catch(e => {
        console.log("No se ha podido registrar", e.message)
        if (e.message == "The email address is already in use by another account.") {
          console.log("Se esta usando este correo electrónico");
        }
      });
  }

  desconectarse() {
    this.authService.salirSesionService();
  }

}
