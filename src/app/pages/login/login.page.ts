import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    public alertController: AlertController,
    private translateService: TranslateService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('Ingresado', user);
      localStorage.setItem('ingresado', 'true');
      this.router.navigate(['/home/', user?.uid]);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Los datos son incorrectos o no se encuentran datos',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}
