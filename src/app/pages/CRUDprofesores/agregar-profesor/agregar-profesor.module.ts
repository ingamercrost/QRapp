import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarProfesorPageRoutingModule } from './agregar-profesor-routing.module';

import { AgregarProfesorPage } from './agregar-profesor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarProfesorPageRoutingModule
  ],
  declarations: [AgregarProfesorPage]
})
export class AgregarProfesorPageModule {}
