import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomedocentePageRoutingModule } from './homedocente-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { HomedocentePage } from './homedocente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomedocentePageRoutingModule,
    TranslateModule
  ],
  declarations: [HomedocentePage]
})
export class HomedocentePageModule {}
