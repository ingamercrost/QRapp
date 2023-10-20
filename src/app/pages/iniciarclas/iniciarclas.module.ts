import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IniciarclasPageRoutingModule } from './iniciarclas-routing.module';

import { IniciarclasPage } from './iniciarclas.page';
import { DatePipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciarclasPageRoutingModule,
    DatePipe,
    ReactiveFormsModule,
  ],
  declarations: [IniciarclasPage]
})
export class IniciarclasPageModule {}
