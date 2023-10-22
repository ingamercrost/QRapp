import { Component, OnInit } from '@angular/core';
import { SasistenciaService } from 'src/app/services/sasistencia.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
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
    profesor: '', // Asegúrate de usar el ID del profesor
    fecha: '',
    alumnos: [],
  };
  codigoQR: string = ''; 
  clases: any[] = [];
  alumnos: any[] = [];
  alumnosDeClase: any[] = [];

  constructor(
    private asistenciasService: SasistenciaService,
    private clasesService: SClasesService,
    private alumnosService: AlumnosService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.clasesService.ListarClase().subscribe((clases: any) => {
      this.clases = clases;
    });

    this.alumnosService.ListarAlumnos().subscribe((alumnos: any) => {
      this.alumnos = alumnos;
    });
  }

  cargarAlumnosDeClase() {
    const claseSeleccionada = this.newAsistencia.clase;

    // Obtén el ID del profesor asociado a la clase seleccionada
    const profesorId = this.clases.find((clase) => clase.id === claseSeleccionada)?.profesor;

    // Llena automáticamente el campo "Profesor" con el ID del profesor
    if (profesorId) {
      this.newAsistencia.profesor = profesorId;
    }

    // Filtra los alumnos de la clase
    this.alumnosDeClase = this.alumnos.filter((alumno) =>
      alumno.clases.includes(claseSeleccionada)
    );
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
            this.asistenciasService.Crearasistencia(this.newAsistencia).subscribe(
              (asistenciaCreada: any) => {
                this.newAsistencia.id = asistenciaCreada.id;
                const asistenciaAlumnos: AlumnoAsistencia[] = this.alumnosDeClase.map((alumno) => ({
                  asistenciaId: this.newAsistencia.id,
                  alumnoId: alumno.id,
                  presente: this.newAsistencia.alumnos.includes(alumno.id),
                }));
                this.actualizarAlumnosAsistencia(asistenciaAlumnos);

                // Redirige al usuario a la página "homedocente"
                this.router.navigate(['/homedocente']);

                // Muestra un mensaje de éxito
                this.mostrarMensajeExito();
              },
              (error) => {
                console.error('Error al crear la asistencia:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Asistencia creada con éxito. ¡Lista pasada!',
      buttons: ['OK'],
    });

    await alert.present();
  }
  
  

  actualizarAlumnosAsistencia(asistenciaAlumnos: AlumnoAsistencia[]) {
    asistenciaAlumnos.forEach((asistenciaAlumno) => {
      const alumno = this.alumnos.find((a) => a.id === asistenciaAlumno.alumnoId);
      if (alumno) {
        if (!alumno.asistencias) {
          alumno.asistencias = [];
        }
        alumno.asistencias.push(asistenciaAlumno);

        this.alumnosService.actualizarAlumno(alumno).subscribe(
          () => {
            console.log('Asistencia del alumno actualizada');
          },
          (error) => {
            console.error('Error al actualizar la asistencia del alumno:', error);
          }
        );
      }
    });
  }

  generarCodigoQR() {
    const asistenciaId = this.newAsistencia.id;
    const codigoQRData = `Clase: ${this.newAsistencia.clase}, Profesor: ${this.newAsistencia.profesor}, alumnos: ${this.newAsistencia.alumnos}, asistenciaId: ${asistenciaId}`;
    this.codigoQR = codigoQRData;
  }
}
