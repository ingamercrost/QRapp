import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  usuarios: any[] = []; // Inicializa el arreglo vacío
  idioma!: string;
  langs: string[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private translateService: TranslateService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.langs = this.translateService.getLangs();
  }
  

  ngOnInit() {
    // Obtener los usuarios desde la URL JSON
    this.http.get('https://qrapp1.onrender.com/alumnos').subscribe((data: any) => {
      this.usuarios = data;
    });
  }

  async login() {
    var u = this.loginForm.value;

    console.log('Valores del formulario:');
    console.log(u);

    if (this.usuarios) {
      const usuarioEncontrado = this.usuarios.find((usuario: any) => usuario.correo === u.email && usuario.contrasena === u.password);

      if (usuarioEncontrado) {
        console.log('Ingresado');
        localStorage.setItem('ingresado', 'true');
        this.router.navigate(['/home/', usuarioEncontrado.id]);
        console.log(this.router.navigate(['/home/', usuarioEncontrado.id]));
      } else {
        const alert = await this.alertController.create({
          header: 'Datos incorrectos',
          message: 'Los datos son incorrectos o no se encuentran datos',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    } else {
      // Manejo de caso cuando no se encuentra el valor en la URL JSON
    }
  }
}

