import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  alumnoId: string = '';
  asistencias: any[] = []; // Define un arreglo para almacenar las asistencias

  constructor(
    private route: ActivatedRoute,
    private alumnoService: AlumnosService // Inyecta tu servicio
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('alumnoId');
    if (idParam) {
      this.alumnoId = idParam;

      // Luego, puedes obtener las asistencias del alumno utilizando tu servicio.
      this.alumnoService.getAsistenciasByAlumnoId(this.alumnoId).subscribe(
        (asistencias: any[]) => {
          this.asistencias = asistencias;
        },
        (error) => {
          console.error('Error al obtener las asistencias', error);
        }
      );
    }
  }
}
