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
  idioma!: string;
  langs: string[] = [];


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    public alertController: AlertController,
    private translateService: TranslateService,
    private authService: AuthService
    
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });

    this.langs = this.translateService.getLangs();
    this.translateService.setDefaultLang('es');
    this.translateService.addLangs(['ru','en']);
    
  }
  changeLang(event:any) {
    this.translateService.use(event.detail.value);
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
        header: this.translateService.instant('datos_incorrectos'),
        message: this.translateService.instant('datos_incorrectos_msg'),
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }

  changeLanguage(language: string) {
    this.translateService.use(language);
  }
}
