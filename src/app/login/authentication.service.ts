import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = this.angularFireAuth.authState;
  }
  accederService(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
  }

  registarseService(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  salirSesionService() {
    this.angularFireAuth.auth.signOut();
  }
}
