import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {Geolocation} from '@awesome-cordova-plugins/geolocation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: 'home', icon: 'home' },
    { title: 'Historial Registros', url: 'historial-registros', icon: 'people' },
    { title: 'Historial Ubicacion', url: 'ubicacion', icon: 'map' },
    { title: 'Asistencia', url: 'asistencia', icon: 'calendar' },
    { title: 'Cuentas', url: 'cuentas', icon: 'people' },
    { title: 'Crud', url: 'crud', icon: 'people' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(private router: Router, private translateService: TranslateService, private geolocation: Geolocation) {
    this.translateService.setDefaultLang('ru');
    this.translateService.addLangs(['es','en','ru']);
    this.getGeolocation();
  }

  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {

      console.log("resp", resp)

      console.log(resp.coords.latitude);
      // Longitud
      console.log(resp.coords.longitude);
      
    }).catch((error) => {
      // Error
      console.log('Error getting location', error);
    });
    
    // Observar la ubicación del usuario
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // Latitud

    });
  }
}
