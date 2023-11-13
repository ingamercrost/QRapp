import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { UsuariosrandomService } from 'src/app/services/usuariosrandom.service';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    private router: Router,
    public alertController: AlertController,
    private navCtrl: NavController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.usuariosrandom.getRandomUser().subscribe((data) => {
      this.user = data.results[0];
      this.crearUsuarioAleatorio(this.user);
    });
  }

  crearUsuarioAleatorio(user: any) {
    if (user) {
      const usuario = {
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
    const docRef = this.firestore.collection<Alumno>('alumnos').add(alumno);
  
    // Actualiza el objeto Alumno con el ID generado
    docRef.then((doc) => {
      alumno.id = doc.id;
  
      // Actualiza la base de datos con el objeto Alumno que ahora contiene el ID
      this.firestore.collection<Alumno>('alumnos').doc(alumno.id).update({ id: alumno.id }).then(() => {
        console.log('Nuevo alumno creado con ID:', alumno.id);
      });
    });
  }
  

  obtenerDatosAleatoriosYCrearAlumnos(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
      this.usuariosrandom.getRandomUser().subscribe((data: any) => {
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
          id: ''
        };

        // Crea el nuevo alumno
        this.crearAlumno(newAlumno);
      });
    }
  }

  async crear20Usuarios() {
    // Llama a la función para obtener datos aleatorios y crear 20 nuevos alumnos
    this.obtenerDatosAleatoriosYCrearAlumnos(5);

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
