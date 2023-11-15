import { Router } from '@angular/router';
import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { NgxScannerQrcodeService } from 'ngx-scanner-qrcode';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  alumno: any;
  authService: any;

  
  constructor(
    @Inject(NgxScannerQrcodeService) private qrcode: NgxScannerQrcodeService,
    private router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    private alumnoServ: AlumnosService,
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private firestore : AngularFirestore
  ) {}

  ngOnInit() {
    this.qrcode.loadFiles().subscribe((scannedData) => {
      this.ngZone.run(() => {
        this.onScan(scannedData);
      });
    });
  }

  async onScan($event: any) {
   
  }

  ionViewWillEnter() {
    this.getUserInfo();
  }

  getUserInfo() {
    this.afAuth.authState.subscribe(
      (user) => {
        if (user?.email) {
          this.alumnoServ.getAlumnoByCorreo(user.email).subscribe(
            (alumno) => {
              this.alumno = alumno[0]; // Asumiendo que el servicio devuelve un array y quieres el primer elemento
              console.log('Datos del alumno:', this.alumno);
            },
            (error) => {
              console.error('Error al obtener datos del alumno:', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error al obtener la información del usuario:', error);
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

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}