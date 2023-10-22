import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profesor } from 'src/app/interfaces/profesor';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { HttpClient } from '@angular/common/http';
import { UsuariosrandomService } from 'src/app/services/usuariosrandom.service';
import { AlertController, NavController } from '@ionic/angular'; // Importa AlertController y NavController

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
    private ProfesorServ: ProfesoresService,
    private router: Router,
    private http: HttpClient,
    public alertController: AlertController, // Agrega AlertController
    private navCtrl: NavController // Agrega NavController
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
        rut: user.login.username,
        nombre: user.name.first,
        apellido: user.name.last,
        correo: user.email,
        contrasena: user.login.password,
      };

      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  }

  crearProfesor(profesor: Profesor) {
    this.ProfesorServ.CrearProfesores(profesor).subscribe(() => {
      console.log('Nuevo profesor creado');
    });
  }

  // Función para obtener datos aleatorios y crear 20 nuevos profesores
  obtenerDatosAleatoriosYCrearProfesores(cantidad: number) {
    for (let i = 0; i < cantidad; i++) {
      this.http.get('https://randomuser.me/api/').subscribe((data: any) => {
        const results = data.results[0];
        const newProfesor: Profesor = {
          rut: results.login.username,
          nombre: results.name.first,
          apellido: results.name.last,
          correo: results.email,
          contrasena: results.login.password,
          clases: [],
          asistencias: [],
        };

        // Crea el nuevo profesor
        this.crearProfesor(newProfesor);
      });
    }
  }

  async crear20Usuarios() {
    // Llama a la función para obtener datos aleatorios y crear 20 nuevos profesores
    this.obtenerDatosAleatoriosYCrearProfesores(20);

    // Muestra una alerta de éxito
    const alert = await this.alertController.create({
      header: 'Usuarios Creados',
      message: 'Se han creado 20 usuarios con éxito',
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
