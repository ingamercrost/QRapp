import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { UsuariosrandomService } from 'src/app/services/usuariosrandom.service';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http'; // Importa el módulo HttpClient

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
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient // Agrega esta línea
  ) {}

  ngOnInit() {
    this.crear20Usuarios();
  }

  async crearUsuarioAleatorio(user: any) {
    if (user) {
      const correo = user.email;
      let contrasena = user.login.password;

      // Verifica si la contraseña tiene menos de 6 caracteres y agrégale '1234'
      if (contrasena.length < 6) {
        contrasena += '1234';
      }

      try {
        // Crea el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(correo, contrasena);

        // Obtiene el UID del usuario creado
        const uid = credential.user?.uid;

        // Guarda el usuario en el localStorage si es necesario
        const usuario = {
          nombre: user.name.first,
          correo: correo,
          contrasena: contrasena,
          rut: user.login.username,
          idFirebase: uid,
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Obtiene el avatar de la API de avatares (Adorable Avatars en este caso)
        const avatarUrl = `https://robohash.org/${uid}.png`;

        // Crea el nuevo alumno con el avatar
        const newAlumno: Alumno = {
          rut: '123e',
          nombre: user.name.first,
          apellido: user.name.last,
          correo: correo,
          contrasena: contrasena,
          carrera: 'Carrera Aleatoria',
          clases: [],
          asistencias: [],
          id: '',
          avatar: avatarUrl, // Agrega el avatar a la propiedad del alumno
        };

        // Registra el nuevo alumno en Firestore
        await this.crearAlumno(newAlumno);

        // Devuelve el nuevo alumno para que se pueda mostrar en la consola
        return newAlumno;
      } catch (error) {
        console.error('Error al crear el usuario en Firebase Authentication:', error);
      }
    }

    // Si hay un problema al crear el usuario, devuelve null
    return null;
  }

  async crearAlumno(alumno: Alumno) {
    // Usa AngularFirestore para crear un nuevo documento de alumno en la base de datos de Firestore
    const docRef = await this.firestore.collection<Alumno>('alumnos').add(alumno);

    // Actualiza el objeto Alumno con el ID generado
    alumno.id = docRef.id;

    // Actualiza la base de datos con el objeto Alumno que ahora contiene el ID
    await this.firestore.collection<Alumno>('alumnos').doc(alumno.id).update({ id: alumno.id });

    console.log('Nuevo alumno creado con ID:', alumno.id);
  }

  async crear20Usuarios() {
    for (let i = 0; i < 3; i++) {
      const data = await this.usuariosrandom.getRandomUser().toPromise();
      const results = data.results[0];

      if (results) {
        const user = await this.crearUsuarioAleatorio(results);

        if (user) {
          console.log('Usuario creado:', user);
        }
      }
    }

    const alert = await this.alertController.create({
      header: 'Usuarios Creados',
      message: 'Se han creado 3 usuarios con éxito',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.navCtrl.navigateForward('/homedocente');
          },
        },
      ],
    });

    await alert.present();
  }
}
