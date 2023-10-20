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
    id : '',
    clase: '', // Inicialmente vacío
    profesor: '', // Aquí asigna el ID del profesor
    fecha: '', // Inicializa la fecha como null
    alumnos: [] // Inicialmente vacío
  };

  clases: any[] = [];
  alumnos: any[] = []; // Arreglo de todos los alumnos
  alumnosDeClase: any[] = []; // Arreglo para almacenar los alumnos de la clase seleccionada

  constructor(
    private asistenciasService: SasistenciaService,
    private clasesService: SClasesService,
    private alumnosService: AlumnosService,
    private router: Router,
  // Inyecta DatePipe
  ) {}

  ngOnInit(): void {
    // Obtener la lista de clases
    this.clasesService.ListarClase().subscribe((clases: any) => {
      this.clases = clases;
    });

    // Obtener la lista de todos los alumnos
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
      () => {
        this.router.navigateByUrl('/listar_clases');
      },
      (error) => {
        console.error('Error al crear la asistencia:', error);
      }
    );
  }
}
