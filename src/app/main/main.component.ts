import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/login/authentication.service';
import { MainService } from 'src/app/main/main.service';

import { Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public documentId = null;
  public currentStatus = 1;
  email;
  tareas = [];
  anyo = '';
  mes = '';
  dia = '';
  //datos tarea unica
  nombre = '';
  fecha = '';
  detalle = '';
  usuario = '';
  tareaId = '';
  //

  public newTareaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    detalle: new FormControl(''),
    /*usuario: new FormControl(''),*/
    /*id: new FormControl('')*/
  });


  constructor(private authService: AuthenticationService, private router: Router,
    private mainService: MainService, private modalService: NgbModal) {
    this.newTareaForm.setValue({
      nombre: '',
      fecha: '',
      detalle: '',
      /*usuario: '',*/
      /*id: ''*/
    })
  }

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

  open(content, tarea, tareaId) {
    if (tarea === undefined) {
      this.modalService.open(content);
    } else {
      this.tareaId = tareaId;
      this.nombre = tarea.nombre;
      this.fecha = tarea.fecha;//no lo coge en el date
      this.detalle = tarea.detalle;
      /*this.usuario = tarea.usuario;*/
      this.modalService.open(content);
    }
  }

  newTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      /*usuario: form.usuario*/
    }
    this.mainService.createTarea(data).then(() => {
      console.log('Documento creado exitósamente!');
      this.newTareaForm.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        /*usuario: ''*/
      });
    }, (error) => {
      console.error(error);
    });

  }

  /*
  else {
      let data = {
        nombre: form.nombre,
        fecha: form.fecha,
        detalle: form.detalle,
        usuario: form.usuario
      }
      this.mainService.updateTarea(documentId, data).then(() => {
        this.currentStatus = 1;
        this.newTareaForm.setValue({
          nombre: '',
          fecha: '',
          detalle: '',
          usuario: ''
        });
        console.log('Documento editado exitósamente');
      }, (error) => {
        console.log(error);
      });
    }
  
  */

  updateTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      /*usuario: form.usuario*/
    }
    /*console.log(documentId);
    console.log(data);*/
    this.mainService.updateTarea(this.tareaId, data).then(() => {
      this.currentStatus = 1;
      this.newTareaForm.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        /*usuario: ''*/
      });
      console.log('Documento editado exitósamente');
    }, (error) => {
      console.log(error);
    });
    /*let update = this.mainService.getTarea(documentId).subscribe((tarea) => {
      this.currentStatus = 2;
      this.documentId = documentId;
      this.newTareaForm.setValue({
        nombre: tarea.payload.data()['nombre'],
        fecha: tarea.payload.data()['fecha'],
        detalle: tarea.payload.data()['detalle'],
        usuario: tarea.payload.data()['usuario'],
        id: documentId
      });
      update.unsubscribe();
    });*/
  }

}
