import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SClasesService } from 'src/app/services/sclases.service';
import { AlumnosService } from 'src/app/services/alumnos.service'; // Asegúrate de que esta importación sea correcta

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  clase = {
    id: '0',
    seccion: 'DC007',
    profesor: 'Juju',
    fecha: '', // Inicializa la fecha con una cadena vacía
    materia: 'Programacion web',
    alumnos: [] as AlumnosService[],
  };

  constructor(private ClaseServ: SClasesService, private router: Router) {}

  ngOnInit(): void {
    // No es necesario implementar nada aquí si no tienes lógica específica
  }

  ionViewWillEnter() {
    this.getClaseByID(this.getIdFromURL().toString()); // Convertir el número a cadena
  }

  getIdFromURL() {
    let url = this.router.url;
    let arr = url.split('/', 3);
    let id = arr[2];
    return id;
  }

  getClaseByID(claseID: string) {
    this.ClaseServ.getClaseByid(String(claseID)).subscribe(
      (resp: any) => {
        this.clase = {
          id: resp[0].id.toString(),
          seccion: resp[0].seccion,
          profesor: resp[0].profesor,
          fecha: this.formatDate(resp[0].fecha), // Formatear la fecha
          materia: resp[0].materia,
          alumnos: resp[0].alumnos as AlumnosService[],
        };
      }
    );
  }

  formatDate(timestamp: number): string {
    if (!isNaN(timestamp) && timestamp > 0) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } else {
      return ''; // Si la fecha no es válida, devuelve una cadena vacía
    }
  }
}


