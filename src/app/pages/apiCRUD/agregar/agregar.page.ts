import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { HttpClient } from '@angular/common/http';
import { UsuariosrandomService } from 'src/app/services/usuariosrandom.service';
import { AlertController, NavController } from '@ionic/angular'; // Importa AlertController y NavController
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa el servicio AngularFirestore

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {

  newAlumnos: Alumno[] = [];
  user: any;

  constructor(
    private usuariosrandom: UsuariosrandomService,
    private AlumnoServ: AlumnosService,
    private router: Router,
    private http: HttpClient,
    public alertController: AlertController, // Agrega AlertController
    private navCtrl: NavController, // Agrega NavController
    private firestore: AngularFirestore // Inyecta el servicio AngularFirestore
  ) {}

  ngOnInit() {
    this.usuariosrandom.getRandomUser().subscribe((data) => {
      this.user = data.results[0];
      this.crearUsuarioAleatorio(this.user);
    });
  }

  crearUsuarioAleatorio(user: any) {
    if (user) {
      var usuario = {
        nombre: user.name.first,
        correo: user.email,
        contrasena: user.login.password,
        rut: user.login.username,
      };

      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  crearAlumno(alumno: Alumno) {
    // Usa AngularFirestore para crear un nuevo documento de alumno en la base de datos de Firestore
    this.firestore.collection<Alumno>('alumnos').add(alumno).then(() => {
      console.log('Nuevo alumno creado');
    });
  }

  // Función para obtener datos aleatorios y crear 20 nuevos alumnos
  obtenerDatosAleatoriosYCrearAlumnos(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
      this.http.get('https://randomuser.me/api/').subscribe((data: any) => {
        const results = data.results[0];
        const newAlumno: Alumno = {
          rut: '123e',
          nombre: results.name.first,
          apellido: results.name.last,
          correo: results.email,
          contrasena: results.login.password,
          carrera: 'Carrera Aleatoria',
          clases: [],
          asistencias: [],
        };

        // Crea el nuevo alumno
        this.crearAlumno(newAlumno);
      });
    }
  }

  async crear20Usuarios() {
    // Llama a la función para obtener datos aleatorios y crear 20 nuevos alumnos
    this.obtenerDatosAleatoriosYCrearAlumnos(20);

    // Muestra una alerta de éxito
    const alert = await this.alertController.create({
      header: 'Usuarios Creados',
      message: 'Se han creado 20 usuarios con éxito',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Redirige al usuario a la página de inicio (u otra página)
            this.navCtrl.navigateForward('/homedocente');
          },
        },
      ],
    });

    await alert.present();
  }
}
