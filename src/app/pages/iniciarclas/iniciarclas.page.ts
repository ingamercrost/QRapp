import { Component, OnInit } from '@angular/core';
import { SasistenciaService } from 'src/app/services/sasistencia.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Router } from '@angular/router';
import { Asistencia, AlumnoAsistencia } from 'src/app/interfaces/asistencia';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-iniciarclas',
  templateUrl: './iniciarclas.page.html',
  styleUrls: ['./iniciarclas.page.scss'],
})
export class IniciarclasPage implements OnInit {

  dataToEncode: string = 'Tus datos a incrustar';


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
    private sii : QRCodeModule
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
    this.alumnosDeClase = this.alumnos.filter((alumno) =>
      alumno.clases.includes(claseSeleccionada)
    );
  }
  
  crearAsistencia() {
    this.asistenciasService.Crearasistencia(this.newAsistencia).subscribe(
      (asistenciaCreada: any) => {
        this.newAsistencia.id = asistenciaCreada.id;

        const asistenciaAlumnos: AlumnoAsistencia[] = this.alumnosDeClase.map((alumno) => ({
          asistenciaId: this.newAsistencia.id, // Usar el ID de la asistencia creada
          alumnoId: alumno.id, // Agregar la propiedad 'alumnoId'
          presente: this.newAsistencia.alumnos.includes(alumno.id),
        }));
        

        this.actualizarAlumnosAsistencia(asistenciaAlumnos);

      },
      (error) => {
        console.error('Error al crear la asistencia:', error);
      }
    );
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
