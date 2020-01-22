import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/login/authentication.service';
import { MainService } from 'src/app/main/main.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  email;
  tareas = [];
  anyo = '';
  mes = '';
  dia = '';

  constructor(private authService: AuthenticationService, private router: Router,
    private mainService: MainService) { }

  ngOnInit() {//Controlo que no entran en el main sin loguearse
    this.authService.logeado().subscribe(auth => {
      if (auth) {
        console.log("Logueado");
        this.authService.userData.subscribe(res => {
          this.email = res.email;
        })
        this.mainService.getTareas().subscribe((tareasService) => {
          this.tareas = [];
          tareasService.forEach((tarea: any) => {
            const date = tarea.payload.doc.data().fecha.toDate();
            this.anyo = date.getFullYear();
            this.mes = date.getMonth() + 1;
            this.dia = date.getDate();
            const fechaBuena = (this.anyo + "/" + this.mes + "/" + this.dia);
            this.tareas.push({
              nombre: tarea.payload.doc.data().nombre,
              detalle: tarea.payload.doc.data().detalle,
              fecha: fechaBuena,
              id: tarea.payload.doc.id
            })
          })
        });
      } else {
        console.log("No logueado");
        this.router.navigateByUrl('/login');
      }
    })
  }

  /*mostrarTareas(){
    console.log(this.tareas);
  }*/

  deleteTarea(documentId) {
    this.mainService.deleteTarea(documentId).then(() => {
      console.log("DOCUMENTO ELIMINADO");
    }, error => {
      console.error(error);
    })
  }

  desconectarse() {
    this.authService.salirSesionService();
    this.email = undefined;
    this.router.navigateByUrl("/login");
  }

}
