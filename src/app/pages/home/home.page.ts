
import { Router } from '@angular/router';
import { Component, ViewChild, OnInit  } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';





@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;

  alumno = {
    id: "a",
    rut:"a",
    nombre:"a",
    apellido:"a",
    correo:"a",
    contrasena:"",
    carrera:"a",
    asistencias: []
  }
 
  constructor(private router: Router, public fb: FormBuilder, public alertController: AlertController, private toastController: ToastController,private alumnoServ:AlumnosService) {

   }


   async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

   ngOnInit() {
  }

  ionViewWillEnter(){
    this.getAlumnoByID(this.getIdFromURL())
  }


  getIdFromURL(){
    let url = this.router.url
    let arr = url.split("/",3)
    let id = String(arr[2])
    return id
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
          asistencias: resp[0].asistencias
        }
      }
    )
  }
  onScan($event: any) {
    // Obtener el ID de la asistencia del código QR.
    const asistenciaId = $event.data.split('asistenciaId: ')[1];
  
    // Marcar la asistencia del alumno.
    this.alumnoServ.marcarAsistencia(this.alumno.id, asistenciaId).subscribe(
      () => {
        // Mostrar un mensaje de confirmación.
        this.presentToast('Asistencia marcada');
      },
      (error) => {
        // Mostrar un mensaje de error.
        this.presentToast('Error al marcar la asistencia');
      }
    );
  }

  



  detalle() {
    this.router.navigate(['/detalle', this.alumno.id]);
  }


  perfil() {
    this.router.navigate(['perfil'])
  }

  login() {
    this.router.navigate(['login'])
  }
}
