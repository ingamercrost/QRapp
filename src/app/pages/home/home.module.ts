import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';
import { HomePage } from './home.page';
import { HomeCompComponent } from 'src/app/components/home-comp/home-comp.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    NgxScannerQrcodeModule,
    TranslateModule
  ],
  declarations: [HomePage, HomeCompComponent]
})
export class HomePageModule {}
