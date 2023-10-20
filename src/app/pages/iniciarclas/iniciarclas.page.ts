import { Component, OnInit } from '@angular/core';
import { SasistenciaService } from 'src/app/services/sasistencia.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Router } from '@angular/router';
import { Asistencia, AlumnoAsistencia } from 'src/app/interfaces/asistencia';

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
  };

  clases: any[] = [];
  alumnos: any[] = [];
  alumnosDeClase: any[] = [];

  constructor(
    private asistenciasService: SasistenciaService,
    private clasesService: SClasesService,
    private alumnosService: AlumnosService,
    private router: Router
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
          alumnoId: alumno.id,
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
}
