import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private firestore: AngularFirestore) { }

  getTareas() {
    return this.firestore.collection("tareas").snapshotChanges();
  }

  createTarea(data: { nombre: string, fecha: Data, detalle: string, usuario: string }) {
    return this.firestore.collection("tareas").add(data);
  }

  updateTarea(documentId: string, data: any) {
    return this.firestore.collection("tareas").doc(documentId).set(data);
  }

  deleteTarea(documentId: string){
    return this.firestore.collection("tareas").doc(documentId).delete();
  }

}
