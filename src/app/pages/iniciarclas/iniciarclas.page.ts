import { Component, OnInit } from '@angular/core';
import { SasistenciaService } from 'src/app/services/sasistencia.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Router } from '@angular/router';
import { Asistencia } from 'src/app/interfaces/asistencia';

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
    // Registra la asistencia
    this.asistenciasService.Crearasistencia(this.newAsistencia).subscribe(
      (asistenciaCreada: any) => {
        this.newAsistencia.id = asistenciaCreada.id;

        // Agrega la asistencia a los alumnos
        this.agregarAsistenciaAAlumnos();

        // Redirige a la página de listado de clases
        this.router.navigateByUrl('/listar_clases');
      },
      (error) => {
        console.error('Error al crear la asistencia:', error);
      }
    );
  }

  agregarAsistenciaAAlumnos() {
    // Agrega la asistencia a los objetos de alumnos correspondientes
    this.newAsistencia.alumnos.forEach((alumnoId) => {
      const alumno = this.alumnos.find((a) => a.id === alumnoId);
      if (alumno) {
        if (!alumno.asistencias) {
          alumno.asistencias = [];
        }
        alumno.asistencias.push({
          id: this.newAsistencia.id,
          presente: true, // Puedes modificar esto según corresponda
        });

        // Llama al servicio para actualizar el alumno
        this.alumnosService.actualizarAlumno(alumno).subscribe(
          () => {
            console.log('Alumno actualizado con la nueva asistencia');
          },
          (error) => {
            console.error('Error al actualizar el alumno:', error);
          }
        );
      }
    });
  }
}

