import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarProfesorPage } from './agregar-profesor.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarProfesorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarProfesorPageRoutingModule {}
