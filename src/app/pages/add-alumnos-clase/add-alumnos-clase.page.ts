import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { SClasesService } from 'src/app/services/sclases.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.alumnosService.ListarAlumnos().subscribe((alumnos: any) => {
      this.alumnos = alumnos;
    });

    this.clasesService.ListarClase().subscribe((clases: any) => {
      this.clases = clases;
    });
  }

  agregarAlumnoAClase() {
    if (!this.alumnoSeleccionado || !this.claseSeleccionada) {
      console.error('Debes seleccionar un estudiante y una clase.');
      return;
    }
  
    const estudiante = this.alumnos.find((a) => a.id === this.alumnoSeleccionado);
    const clase = this.clases.find((c) => c.id === this.claseSeleccionada);
  
    if (!estudiante || !clase) {
      console.error('No se encontró el estudiante o la clase seleccionada.');
      return;
    }
  
    // Verificar si el estudiante ya está vinculado a la clase
    if (clase.alumnos && clase.alumnos.includes(estudiante.id)) {
      console.error('El estudiante ya está vinculado a esta clase.');
      return;
    }
  
    // Verificar si la clase ya está vinculada al estudiante
    if (estudiante.clases && estudiante.clases.includes(clase.id)) {
      console.error('La clase ya está vinculada a este estudiante.');
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
  
    const urlEstudiante = `${environment.apiURL}/alumnos/${estudiante.id}`;
    const urlClase = `${environment.apiURL}/clases/${clase.id}`;
  
    this.http.put(urlEstudiante, estudiante).subscribe(
      (respuesta) => {
        console.log('ID de la clase agregado al estudiante con éxito');
      },
      (error) => {
        console.error('Error al agregar ID de la clase al estudiante', error);
      }
    );
  
    this.http.put(urlClase, clase).subscribe(
      (respuesta) => {
        console.log('Estudiante agregado a la clase con éxito');
      },
      (error) => {
        console.error('Error al agregar estudiante a la clase', error);
      }
    );
  }
  
}





