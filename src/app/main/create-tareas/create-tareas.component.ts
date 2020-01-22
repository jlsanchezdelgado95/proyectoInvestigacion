import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MainService } from 'src/app/main/main.service';

@Component({
  selector: 'app-create-tareas',
  templateUrl: './create-tareas.component.html',
  styleUrls: ['./create-tareas.component.css']
})
export class CreateTareasComponent implements OnInit {

  public documentId = null;
  public currentStatus = 1;
  public newTareaForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    fecha: new FormControl('', Validators.required),
    detalle: new FormControl(''),
    usuario: new FormControl('')
  });

  closed = true;
  closed2 = true;

  constructor(private mainService: MainService) {
    this.newTareaForm.setValue({
      nombre: '',
      fecha: '',
      detalle: '',
      usuario: ''
    })
  }

  ngOnInit() {
  }

  newTarea(form, documentId = this.documentId) {
    const fechaBuena = new Date(new Date(form.fecha).getTime());
    let data = {
      nombre: form.nombre,
      fecha: fechaBuena,
      detalle: form.detalle,
      usuario: form.usuario
    }
    this.mainService.createTarea(data).then(() => {
      this.closed = false;
      this.newTareaForm.setValue({
        nombre: '',
        fecha: '',
        detalle: '',
        usuario: ''
      })
    }, (error) => {
      this.closed2 = false;
      console.log(error);
    })
  }

}
