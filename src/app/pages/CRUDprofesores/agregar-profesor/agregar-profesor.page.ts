import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profesor } from 'src/app/interfaces/profesor';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { HttpClient } from '@angular/common/http';
import { UsuariosrandomService } from 'src/app/services/usuariosrandom.service';
import { AlertController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth

@Component({
  selector: 'app-agregar-profesor',
  templateUrl: './agregar-profesor.page.html',
  styleUrls: ['./agregar-profesor.page.scss'],
})
export class AgregarProfesorPage implements OnInit {
  newProfesores: Profesor[] = [];
  user: any;

  constructor(
    private usuariosrandom: UsuariosrandomService,
    private profesorServ: ProfesoresService,
    private router: Router,
    private http: HttpClient,
    public alertController: AlertController,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth // Agrega AngularFireAuth
  ) {}

  ngOnInit() {
    // Puedes cargar un usuario aleatorio cuando se inicializa la página
    this.usuariosrandom.getRandomUser().subscribe((data) => {
      this.user = data.results[0];
    });
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
          rut: user.login.username,
          nombre: user.name.first,
          apellido: user.name.last,
          correo: correo,
          contrasena: contrasena,
          idFirebase: uid,
        };
  
        localStorage.setItem('usuario', JSON.stringify(usuario));
  
        // Crea el nuevo profesor
        const newProfesor: Profesor = {
          rut: user.login.username,
          nombre: user.name.first,
          apellido: user.name.last,
          correo: correo,
          contrasena: contrasena,
          clases: [],
          asistencias: [],
        };
  
        // Crea el profesor en Firestore
        await this.crearProfesor(newProfesor);
  
        // Devuelve el nuevo profesor para que se pueda mostrar en la consola
        return newProfesor;
      } catch (error) {
        console.error('Error al crear el usuario en Firebase Authentication:', error);
      }
    }
  
    // Si hay un problema al crear el usuario, devuelve null
    return null;
  }
  

  async crearProfesor(profesor: Profesor) {
    // Usa el servicio ProfesoresService para agregar el nuevo profesor a Firestore
    this.profesorServ.CrearProfesores(profesor).then(() => {
      console.log('Nuevo profesor creado');
    });
  }

  async crear20Usuarios() {
    // Obtiene 20 usuarios aleatorios
    for (let i = 0; i < 1; i++) {
      const data = await this.usuariosrandom.getRandomUser().toPromise();
      const results = data.results[0];

      if (results) {
        // Crea el usuario aleatorio
        await this.crearUsuarioAleatorio(results);
      }
    }

    // Muestra una alerta de éxito
    const alert = await this.alertController.create({
      header: 'Profesores Creados',
      message: 'Se han creado 20 profesores con éxito',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            // Redirige al usuario a la página de inicio de docente (homedocente)
            this.navCtrl.navigateForward('/homedocente');
          },
        },
      ],
    });

    await alert.present();
  }
}
