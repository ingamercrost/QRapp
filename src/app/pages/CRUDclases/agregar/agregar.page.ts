import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Iclase } from 'src/app/interfaces/iclase';
import { SClasesService } from 'src/app/services/sclases.service';
import { ProfesoresService } from 'src/app/services/profesores.service';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

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
    asistencias: [],
    id: ""
  };

  profesoresDisponibles: any[] = [];

  constructor(
    private ClaseServ: SClasesService,
    private router: Router,
    private profesoresService: ProfesoresService,
    public alertController: AlertController,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    this.obtenerProfesoresDisponibles();
  }

  obtenerProfesoresDisponibles() {
    this.firestore.collection('profesores').valueChanges().subscribe((profesores: any) => {
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

  // Función para buscar un profesor por ID antes de crear la clase
  buscarProfesorYCrearClase(profesorId: string) {
    // Puedes agregar lógica adicional según tus necesidades
    this.firestore.collection('profesores').doc(profesorId).get().subscribe((profesor: any) => {
      const profesorData = profesor.data();
      if (profesorData) {
        this.newClase.profesor = profesorData.nombre; // Asigna el nombre del profesor a la clase
        this.crearClase(); // Llama a la función para crear la clase
      } else {
        console.error('Profesor no encontrado');
        // Manejar la situación donde el profesor no fue encontrado
      }
    });
  }

  crearClase() {
    // Usa AngularFirestore para crear un nuevo documento de clase en la base de datos de Firestore
    const docRef = this.firestore.collection<Iclase>('clases').add(this.newClase);

    // Obtén el ID asignado al documento recién creado
    docRef.then((doc) => {
      // Asigna el ID al objeto Iclase
      this.newClase.id = doc.id;

      // Actualiza la base de datos con el objeto Iclase que ahora contiene el ID
      this.firestore.collection<Iclase>('clases').doc(this.newClase.id).update({ id: this.newClase.id }).then(() => {
        console.log('Nueva clase creada con ID:', this.newClase.id);

        this.mostrarMensajeExito(); // Llama a la función para mostrar el mensaje de éxito
      });
    });
  }

  // Función para manejar la creación de la clase con un profesor específico
  crearClaseConProfesorEspecifico(profesorId: string) {
    // Puedes agregar lógica adicional según tus necesidades antes de crear la clase
    this.buscarProfesorYCrearClase(profesorId);
  }
}
