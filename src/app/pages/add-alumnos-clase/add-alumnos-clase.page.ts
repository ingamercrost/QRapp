import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-alumnos-clase',
  templateUrl: './add-alumnos-clase.page.html',
  styleUrls: ['./add-alumnos-clase.page.scss'],
})
export class AddAlumnosClasePage implements OnInit {
  alumnos: any[] = [];
  clases: any[] = [];
  alumnoSeleccionado: string = '';
  claseSeleccionada: string = '';

  constructor(
    private alumnosService: AlumnosService,
    private clasesService: SClasesService,
    private http: HttpClient,
    public alertController: AlertController, // Inyecta el servicio de AlertController
    public firestore: AngularFirestore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.firestore.collection('alumnos').get().subscribe((alumnosSnapshot: any) => {
      this.alumnos = alumnosSnapshot.docs.map((doc: QueryDocumentSnapshot<any>) => ({ id: doc.id, ...doc.data() }));
    });

    this.firestore.collection('clases').get().subscribe((clasesSnapshot: any) => {
      this.clases = clasesSnapshot.docs.map((doc: QueryDocumentSnapshot<any>) => ({ id: doc.id, ...doc.data() }));
    });
  }

  trackById(index: number, item: any): any {
    return item.id; // Asegúrate de que 'id' es el identificador único de tus elementos
  }

  async mostrarAlertaExitosa(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async mostrarAlertaError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  agregarAlumnoAClase() {
    if (!this.alumnoSeleccionado || !this.claseSeleccionada) {
      this.mostrarAlertaError('Debes seleccionar un estudiante y una clase.');
      return;
    }
  
    const estudiante = this.alumnos.find((a) => a.id === this.alumnoSeleccionado);
    const clase = this.clases.find((c) => c.id === this.claseSeleccionada);
  
    if (!estudiante || !clase) {
      this.mostrarAlertaError('No se encontró el estudiante o la clase seleccionada.');
      return;
    }
  
    // Verificar si el estudiante ya está vinculado a la clase
    if (clase.alumnos && clase.alumnos.includes(estudiante.id)) {
      this.mostrarAlertaError('El estudiante ya está vinculado a esta clase.');
      return;
    }
  
    // Verificar si la clase ya está vinculada al estudiante
    if (estudiante.clases && estudiante.clases.includes(clase.id)) {
      this.mostrarAlertaError('La clase ya está vinculada a este estudiante.');
      return;
    }
  
    // Continuar con la adición de los IDs si no hay conflictos
    if (!estudiante.clases) {
      estudiante.clases = [];
    }
    estudiante.clases.push(clase.id);
  
    if (!clase.alumnos) {
      clase.alumnos = [];
    }
    clase.alumnos.push(estudiante.id);
  
    // Actualiza el documento del estudiante en Firestore
    this.firestore.collection('alumnos').doc(estudiante.id).update({
      clases: estudiante.clases,
    }).then(() => {
      this.mostrarAlertaExitosa('ID de la clase agregado al estudiante con éxito');
    });
  
    // Actualiza el documento de la clase en Firestore
    this.firestore.collection('clases').doc(clase.id).update({
      alumnos: clase.alumnos,
    }).then(() => {
      this.mostrarAlertaExitosa('Estudiante agregado a la clase con éxito');
    });
  }
}
