import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

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
  @ViewChild("bienvenida", { static: false }) bienvenida: ElementRef;
  @ViewChild("nuevaTarea", { static: false }) nuevaTarea: ElementRef;
  @ViewChild("deleteModal", { static: false }) deleteTareaRef: ElementRef;
  @ViewChild("despedidaModal", { static: false }) despedidaModalRef: ElementRef;
  @ViewChild("updateModal", { static: false }) updateModalRef: ElementRef;

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
        //console.log("Logueado");
        this.modalService.open(this.bienvenida);
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
        //console.log("No logueado");
        this.router.navigateByUrl('/login');
      }
    })
  }

  deleteTarea() {
    this.mainService.deleteTarea(this.tareaId).then(() => {
      console.log("DOCUMENTO ELIMINADO");
      this.modalService.dismissAll(this.deleteTareaRef);
    }, error => {
      console.error(error);
    })
  }

  desconectarse() {
    this.authService.salirSesionService();
    this.email = undefined;
    this.modalService.open(this.despedidaModalRef);
    this.router.navigateByUrl("/login");
  }

  openCreate(content) {
    this.modalService.open(content);
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
      this.modalService.dismissAll(this.nuevaTarea);
      this.modalService.open(this.nuevaTarea);
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
      this.modalService.dismissAll(this.updateTarea);
      this.modalService.open(this.updateModalRef);
    }, (error) => {
      console.log(error);
    });
  }

}
