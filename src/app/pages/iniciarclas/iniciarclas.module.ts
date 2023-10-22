import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    QRCodeModule
 // Agrega QrCodeModule a tus imports
  ],
  declarations: [IniciarclasPage],
})
export class IniciarclasPageModule {}
