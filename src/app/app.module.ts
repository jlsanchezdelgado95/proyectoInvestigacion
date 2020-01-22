import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

//Librerías de firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
/*import { AngularFireStorageModule } from '@angular/fire/storage';*/
import { AngularFireAuthModule } from '@angular/fire/auth';

//Le añado el servicio
import { AngularFirestore } from '@angular/fire/firestore';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';
import { CreateTareasComponent } from './main/create-tareas/create-tareas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    PaginaNoEncontradaComponent,
    CreateTareasComponent
  ],
  imports: [
    NgbModule,
    AngularFireModule.initializeApp(environment.fireBaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { 
  db = AngularFirestoreModule;
 }
