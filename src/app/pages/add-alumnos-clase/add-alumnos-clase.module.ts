import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddAlumnosClasePageRoutingModule } from './add-alumnos-clase-routing.module';

import { AddAlumnosClasePage } from './add-alumnos-clase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddAlumnosClasePageRoutingModule
  ],
  declarations: [AddAlumnosClasePage]
})
export class AddAlumnosClasePageModule {}
