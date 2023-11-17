import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {

  formularioRecuperacion: FormGroup;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public alertController: AlertController,
    private toastController: ToastController,
    private afAuth: AngularFireAuth
  ) {
    this.formularioRecuperacion = this.fb.group({
      'correo': ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  async recuperar() {
    const email = this.formularioRecuperacion.value.correo;

    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Correo de restablecimiento enviado correctamente.');
      this.mensajeToast('Se envió un mensaje de recuperación a su correo');
      this.router.navigate(['login']);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Hubo un error al enviar el correo de restablecimiento. Por favor, inténtelo de nuevo.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }

  async mensajeToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}