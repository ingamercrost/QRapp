import { Router } from '@angular/router';
import { Component, NgIterable, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Ialumnos } from 'src/app/interfaces/ialumnos';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {
  alumno: NgIterable<Ialumnos>;

  constructor(
    private router: Router,
    private alumnoServ: AlumnosService,
  ) {
    this.alumno = [];
  }

  ngOnInit() {}

  ionViewWillEnter() {
    const alumnoID = this.getIdFromURL();
    this.getAlumnoByID(alumnoID);
  }

  getIdFromURL() {
    let url = this.router.url;
    let arr = url.split('/', 3);
    let id = String(arr[2]);
    return id;
  }

  getAlumnoByID(alumnoID: string) {
    this.alumnoServ.getAlumnoByid(alumnoID).subscribe(
      (resp: Ialumnos) => {
        if (resp) {
          this.alumno = [resp];
          console.log('Alumno asignado:', this.alumno);
        }
      },
      (error) => {
        console.error('Error al obtener el alumno:', error);
      }
    );
  }
}