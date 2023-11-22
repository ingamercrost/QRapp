import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Agrega AngularFireAuth
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formularioRegistro: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private toastController: ToastController,
    private afAuth: AngularFireAuth, // Agrega AngularFireAuth
    private firestore: AngularFirestore
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      // Agrega otros campos según tus necesidades
    });
  }

  ngOnInit() {
  }

  async guardarDatosManualmente() {
    if (this.formularioRegistro.valid) {
      try {
        const { nombre, correo, contrasena } = this.formularioRegistro.value;

        // Crea el usuario en Firebase Authentication
        const credential = await this.afAuth.createUserWithEmailAndPassword(correo, contrasena);

        // Obtiene el UID del usuario creado
        const uid = credential.user?.uid;

        // Guarda el usuario en el localStorage si es necesario
        const usuario = {
          nombre: nombre,
          correo: correo,
          contrasena: contrasena,
          idFirebase: uid,
        };

        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Puedes realizar operaciones adicionales según tus necesidades
        const avatarUrl = `https://robohash.org/${nombre}.png`;

        // Crea el nuevo alumno con el avatar
        const newAlumno = {
          rut: '123e',
          nombre: nombre,
          apellido: '',
          correo: correo,
          contrasena: contrasena,
          carrera: 'Carrera Aleatoria',
          clases: [],
          asistencias: [],
          id: '',
          avatar: avatarUrl,
        };

        // Registra el nuevo alumno en Firestore
        await this.crearAlumno(newAlumno);

        const toast = await this.toastController.create({
          message: 'Datos guardados correctamente',
          duration: 2000,
        });

        await toast.present();
      } catch (error) {
        console.error('Error al guardar los datos:', error);

        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al guardar los datos',
          buttons: ['Aceptar'],
        });

        await alert.present();
      }
    }
  }

  async crearAlumno(alumno: any) {
    // Usa AngularFirestore para crear un nuevo documento de alumno en la base de datos de Firestore
    const docRef = await this.firestore.collection('alumnos').add(alumno);

    // Actualiza el objeto Alumno con el ID generado
    alumno.id = docRef.id;

    // Actualiza la base de datos con el objeto Alumno que ahora contiene el ID
    await this.firestore.collection('alumnos').doc(alumno.id).update({ id: alumno.id });

    console.log('Nuevo alumno creado con ID:', alumno.id);
  }
}
