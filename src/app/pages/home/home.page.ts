import { Router } from '@angular/router';
import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { NgxScannerQrcodeService, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode'; // Importa ScannerQRCodeSelectedFiles
import { AlumnosService } from 'src/app/services/alumnos.service';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs/internal/Observable';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { Asistencia } from 'src/app/interfaces/asistencia'; // Ajusta la ruta según tu estructura de archivos

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  alumno: any;
  authService: any;
  asistenciaIdInput: string = '';
  ultimasAsistencias: Asistencia[] = [];
  showScanner: boolean = false;

  constructor(
    @Inject(NgxScannerQrcodeService) private qrcode: NgxScannerQrcodeService,
    private router: Router,
    public alertController: AlertController,
    private toastController: ToastController,
    private alumnoServ: AlumnosService,
    private ngZone: NgZone,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.getAdvice();
  
    this.qrcode.loadFiles().subscribe((scannedData: ScannerQRCodeSelectedFiles[]) => {
      if (scannedData && scannedData.length > 0) {
        // Supongamos que deseas utilizar solo el primer elemento escaneado
        const firstScan = scannedData[0].file;
        this.ngZone.run(() => {
          this.onScan(firstScan);
        });
      }
    });
  }

  async onScan(scannedFile: File) {
    // Implementa la lógica para manejar los datos escaneados aquí
    // Puedes mostrar un alert, un toast o realizar otras acciones según tus necesidades
  
    // Supongamos que deseas utilizar el nombre del archivo como dato escaneado
    const scannedData = scannedFile.name;
  
    console.log('QR Code Scanned:', scannedData);
  
    // Aquí puedes agregar la lógica para marcar la asistencia con el ID escaneado
    this.asistenciaIdInput = scannedData;
    this.marcarPresente();
  }

  ionViewWillEnter() {
    this.getUserInfo();
  }

  obtenerUltimasAsistencias() {
    if (this.alumno && this.alumno.asistencias) {
      // Ordena las asistencias por fecha de forma descendente
      // Dentro de la función obtenerUltimasAsistencias
      const asistenciasOrdenadas = this.alumno.asistencias.sort((a: Asistencia, b: Asistencia) => {
        const fechaA = Date.parse(a.fecha as string);
        const fechaB = Date.parse(b.fecha as string);
      
        if (!isNaN(fechaA) && !isNaN(fechaB)) {
          return fechaB - fechaA;
        } else {
          console.error('Error al parsear las fechas.');
          return 0; // o alguna lógica para manejar el caso de error
        }
      });

      // Toma las primeras 3 asistencias
      this.ultimasAsistencias = asistenciasOrdenadas.slice(0, 3);
    }
  }

  getCurrentLocationDetails(): Promise<{ latitude: number, longitude: number, locationName: string }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          // Obtén el nombre de la ubicación
          this.getLocationName(location.latitude, location.longitude)
            .then((locationName) => {
              resolve({ ...location, locationName });
            })
            .catch((error) => {
              console.error('Error al obtener el nombre de la ubicación:', error);
              resolve({ ...location, locationName: 'Nombre de la ubicación no disponible' });
            });
        },
        (error) => reject(error)
      );
    });
  }

  getLocationName(latitude: number, longitude: number): Promise<string> {
    const apiKey = 'AIzaSyCBDQbhfbnWxl0gz_NKizDYIiPlpNk24DM'; // Reemplaza con tu clave de API

    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    return this.http.get<any>(geocodingUrl).toPromise().then((data) => {
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error('No se pudo obtener el nombre de la ubicación.');
      }
    });
  }

  getUserInfo() {
    this.afAuth.authState.subscribe(
      (user) => {
        if (user?.email) {
          this.alumnoServ.getAlumnoByCorreo(user.email).subscribe(
            (alumno) => {
              this.alumno = alumno[0]; // Assuming the service returns an array, and you want the first element
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

  async mostrarUltimasAsistencias() {
    this.obtenerUltimasAsistencias();

    if (this.ultimasAsistencias.length > 0) {
      const alert = await this.alertController.create({
        header: 'Últimas 3 Asistencias',
        message: this.ultimasAsistencias.map(asistencia => `- Fecha: ${asistencia.fecha}`).join('\n'),
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      const toast = await this.toastController.create({
        message: 'No hay asistencias registradas.',
        duration: 2000,
        position: 'bottom',
      });

      await toast.present();
    }
  }

  asistencia() {
    // Call the marcarPresente function here
    this.marcarPresente();
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

  // Function to mark attendance in Firestore
  async marcarPresente() {
    // Ensure 'alumno' is defined before accessing its properties
    if (this.alumno && this.alumno.id) {
      // Check if 'asistencias' array exists
      if (!this.alumno.asistencias) {
        this.alumno.asistencias = [];
      }
  
      // Find the index of the latest 'asistencia' entry (assuming it's the last one)
      const latestAsistenciaIndex = this.alumno.asistencias.length - 1;
  
      // Check if the latest 'asistencia' entry exists and is not marked as present
      if (
        latestAsistenciaIndex >= 0 &&
        !this.alumno.asistencias[latestAsistenciaIndex].presente
      ) {
        try {
          // Get the current location details
          const locationDetails = await this.getCurrentLocationDetails();
  
          // Update the existing 'asistencia' entry with location information
          this.alumno.asistencias[latestAsistenciaIndex] = {
            presente: true,
            fecha: this.alumno.asistencias[latestAsistenciaIndex].fecha,
            asistenciaId: this.alumno.asistencias[latestAsistenciaIndex].asistenciaId,
            alumnoId: this.alumno.id,
            ubicacion: {
              latitud: locationDetails.latitude,
              longitud: locationDetails.longitude,
              nombre: locationDetails.locationName,
            },
            // Add more fields as needed
          };
  
          // Log the data before updating Firestore
          console.log('Data to be updated in Firestore:', this.alumno);
  
          // Update the Firestore document with the modified 'asistencias' array
          await this.firestore.collection('alumnos').doc(this.alumno.id).update(this.alumno);
  
          // Mostrar un toast indicando que el alumno está presente
          const toast = await this.toastController.create({
            message: '¡Asistencia marcada! El alumno está presente.',
            duration: 2000,
            position: 'bottom',
            color: 'success', // Puedes ajustar el color según tus preferencias
          });
  
          await toast.present();
  
          console.log('Asistencia marcada exitosamente.');
        } catch (error) {
          console.error('Error al marcar asistencia:', error);
  
          // Mostrar un toast en caso de error
          const toast = await this.toastController.create({
            message: 'Error al marcar la asistencia.',
            duration: 2000,
            position: 'bottom',
            color: 'danger', // Puedes ajustar el color según tus preferencias
          });
  
          await toast.present();
        }
      } else {
        console.error('Error: Latest asistencia is already marked as present or does not exist.');
  
        // Mostrar un toast si ya está marcada como presente
        const toast = await this.toastController.create({
          message: 'La asistencia ya está marcada como presente.',
          duration: 2000,
          position: 'bottom',
          color: 'warning', // Puedes ajustar el color según tus preferencias
        });
  
        await toast.present();
      }
    } else {
      console.error('Error: "alumno" is undefined or does not have an "id" property.');
    }
  }

  advice: string = ''; // Agrega esta línea
  async getAdvice() {
    const adviceApiUrl = 'https://api.adviceslip.com/advice';
    
    this.http.get<any>(adviceApiUrl).subscribe(
      (data) => {
        if (data && data.slip && data.slip.advice) {
          this.advice = data.slip.advice;
        } else {
          console.error('No se pudo obtener un consejo de la API.');
        }
      },
      (error) => {
        console.error('Error al obtener un consejo de la API:', error);
      }
    );
  }
  
  getCurrentLocation(): Promise<{ latitude: number, longitude: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
        (error) => reject(error)
      );
    });
  }
}