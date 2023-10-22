import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Iclase } from 'src/app/interfaces/iclase';
import { SClasesService } from 'src/app/services/sclases.service';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage implements OnInit {
  newClase: Iclase = {
    seccion: "DC007",
    profesor: "",
    fecha: "",
    materia: "Programación web",
    alumnos: [],
    asistencias: []
  }

  profesoresDisponibles: any[] = [];

  constructor(
    private ClaseServ: SClasesService,
    private router: Router,
    private profesoresService: ProfesoresService,
    public alertController: AlertController // Inyecta el servicio de AlertController
  ) { }

  ngOnInit() {
    this.obtenerProfesoresDisponibles();
  }

  obtenerProfesoresDisponibles() {
    this.profesoresService.ListarProfesores().subscribe((profesores: any) => {
      this.profesoresDisponibles = profesores;
    });
  }

  async mostrarMensajeExito() {
    const alert = await this.alertController.create({
      header: 'Clase Creada',
      message: 'La clase se ha creado con éxito',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.router.navigateByUrl('/listar_clases');
          }
        }
      ]
    });

    await alert.present();
  }

  crearClase() {
    this.ClaseServ.CrearClase(this.newClase).subscribe(() => {
      this.mostrarMensajeExito(); // Llama a la función para mostrar el mensaje de éxito
    });
  }
}
