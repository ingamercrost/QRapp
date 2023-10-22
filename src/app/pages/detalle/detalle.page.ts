import { ActivatedRoute, Router } from '@angular/router';
import { Component, NgIterable, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Ialumnos, Asistencia } from 'src/app/interfaces/ialumnos';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})

export class DetallePage implements OnInit {
  alumno = {
    id: "a",
    rut: "a",
    nombre: "a",
    apellido: "a",
    correo: "a",
    contrasena: "",
    carrera: "a",
    asistencias: [] as Asistencia[] // Definir un tipo para asistencias
  }

  constructor(
    private route: ActivatedRoute, // Inyecta ActivatedRoute
    private router: Router,
    private alumnoServ: AlumnosService,
  ) {
    
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

  getAlumnoByID(alumnoID:String){
    this.alumnoServ.getAlumnoByid(alumnoID).subscribe(
      (resp:any) => {
        this.alumno = {
          id: resp[0].id,
          rut: resp[0].rut,
          nombre: resp[0].nombre,
          apellido: resp[0].apellido,
          correo: resp[0].correo,
          contrasena: resp[0].contrasena,
          carrera: resp[0].carrera,
          asistencias: resp[0].asistencia
        }
      }
    )
  }
}