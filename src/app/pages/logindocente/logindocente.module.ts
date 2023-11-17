import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogindocentePageRoutingModule } from './logindocente-routing.module';

import { LogindocentePage } from './logindocente.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogindocentePageRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [LogindocentePage]
})
export class LogindocentePageModule {}
