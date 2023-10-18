import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAlumnosClasePage } from './add-alumnos-clase.page';

const routes: Routes = [
  {
    path: '',
    component: AddAlumnosClasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAlumnosClasePageRoutingModule {}
