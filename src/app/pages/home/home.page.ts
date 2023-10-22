import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, NgZone, Inject  } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { NgxScannerQrcodeService } from 'ngx-scanner-qrcode';





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

  constructor(
    @Inject(NgxScannerQrcodeService) private qrcode: NgxScannerQrcodeService,
    private router: Router,
    public fb: FormBuilder,
    public alertController: AlertController,
    private toastController: ToastController,
    private alumnoServ: AlumnosService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.qrcode.loadFiles().subscribe((scannedData) => {
      this.ngZone.run(() => {
        this.onScan(scannedData);
      });
    });
  }

  onScan($event: any) {
    // Obtener el ID de la asistencia del código QR.
    const asistenciaId = $event.data.split('asistenciaId: ')[1];

    // Marcar la asistencia del alumno como "presente".
    this.alumnoServ
      .actualizarAsistenciaAlumno(this.alumno.id, asistenciaId, true)
      .subscribe(
        () => {
          // Mostrar un mensaje de confirmación.
          this.toastController.create({
            message: 'Asistencia registrada correctamente',
            duration: 2000,
          });
        },
        (error) => {
          // Mostrar un mensaje de error.
          this.toastController.create({
            message: error.message,
            duration: 2000,
          });
        }
      );
  }

  ionViewWillEnter() {
    this.getAlumnoByID(this.getIdFromURL());
  }

  getIdFromURL() {
    let url = this.router.url;
    let arr = url.split('/', 3);
    let id = String(arr[2]);
    return id;
  }

  getAlumnoByID(alumnoID: String) {
    this.alumnoServ.getAlumnoByid(alumnoID).subscribe(
      (resp: any) => {
        this.alumno = {
          id: resp[0].id,
          rut: resp[0].rut,
          nombre: resp[0].nombre,
          apellido: resp[0].apellido,
          correo: resp[0].correo,
          contrasena: resp[0].contrasena,
          carrera: resp[0].carrera,
          asistencias: resp[0].asistencias,
        };
      }
    );
  }

  asistencia() {
    this.router.navigate(['/asistencia', this.alumno.id]);
  }

  detalle() {
    this.router.navigate(['/detalle', this.alumno.id]);
  }

  perfil() {
    this.router.navigate(['perfil']);
  }

  login() {
    this.router.navigate(['login']);
  }
}