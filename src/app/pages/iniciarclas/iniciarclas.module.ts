import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IniciarclasPageRoutingModule } from './iniciarclas-routing.module';
import { IniciarclasPage } from './iniciarclas.page';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IniciarclasPageRoutingModule,
    DatePipe,
    ReactiveFormsModule,
    QRCodeModule,
    TranslateModule
 // Agrega QrCodeModule a tus imports
  ],
  declarations: [IniciarclasPage],
})
export class IniciarclasPageModule {}
