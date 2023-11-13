import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Asistencia, AlumnoAsistencia } from 'src/app/interfaces/asistencia';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-iniciarclas',
  templateUrl: './iniciarclas.page.html',
  styleUrls: ['./iniciarclas.page.scss'],
})
export class IniciarclasPage implements OnInit {
  newAsistencia: Asistencia = {
    id: '',
    clase: '',
    profesor: '',
    fecha: '',
    alumnos: [],
    codigoQR: '',
  };
  codigoQR: string = '';
  clases: any[] = [];
  alumnos: any[] = [];
  alumnosDeClase: any[] = [];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.firestore.collection('clases').valueChanges().subscribe((clases: any) => {
      this.clases = clases;
    });

    this.firestore.collection('alumnos').valueChanges().subscribe((alumnos: any) => {
      this.alumnos = alumnos;
    });
  }

  cargarAlumnosDeClase() {
    const claseSeleccionada = this.newAsistencia.clase;

    const claseSeleccionadaInfo = this.clases.find((clase) => clase.id === claseSeleccionada);

    if (claseSeleccionadaInfo) {
      this.newAsistencia.profesor = claseSeleccionadaInfo.profesor;
      this.alumnosDeClase = this.alumnos.filter((alumno) =>
        alumno.clases.includes(claseSeleccionada)
      );
    } else {
      console.error('La clase no existe en la base de datos.');
    }
  }

  async crearAsistencia() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Quieres crear la asistencia?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          },
        },
        {
          text: 'Sí, crear asistencia',
          handler: () => {
            this.firestore.collection('asistencias').add(this.newAsistencia).then((asistenciaRef) => {
              this.newAsistencia.id = asistenciaRef.id;
              this.generarCodigoQR();

              const asistenciaAlumnos: AlumnoAsistencia[] = this.alumnosDeClase.map((alumno) => ({
                asistenciaId: this.newAsistencia.id,
                alumnoId: alumno.id,
                presente: this.newAsistencia.alumnos.includes(alumno.id),
              }));

              this.actualizarAlumnosAsistencia(asistenciaAlumnos);
              this.mostrarMensajeExito();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  generarCodigoQR() {
    const asistenciaId = this.newAsistencia.id;
    const codigoQRData = `asistenciaId: ${asistenciaId}, codigoQR: ${this.codigoQR}`;
    this.codigoQR = codigoQRData;
  }

  actualizarAlumnosAsistencia(asistenciaAlumnos: AlumnoAsistencia[]) {
    asistenciaAlumnos.forEach((asistenciaAlumno) => {
      const alumno = this.alumnos.find((a) => a.id === asistenciaAlumno.alumnoId);
      if (alumno && asistenciaAlumno.alumnoId) {
        alumno.asistencias.push(asistenciaAlumno);

        this.firestore.collection('alumnos').doc(alumno.id).update({
          asistencias: alumno.asistencias,
        }).then(
          () => {
            console.log('Asistencia del alumno actualizada con éxito');
          },
          (error) => {
            console.log('Error al actualizar la asistencia del alumno:', error);
          }
        );
      } else {
        console.warn('Se descartó la asistencia del alumno', asistenciaAlumno);
      }
    });
  }

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Los alumnos seleccionados quedaron presentes, ahora se generará el código QR',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
