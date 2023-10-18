import { Component, OnInit } from '@angular/core';
import { SClasesService } from 'src/app/services/sclases.service';

@Component({
  selector: 'app-lista-clases',
  templateUrl: './lista-clases.component.html',
  styleUrls: ['./lista-clases.component.scss'],
})
export class ListaClasesComponent implements OnInit {
  clases: any[] = []; // Array para almacenar clases

  constructor(private clasesService: SClasesService) {}

  ngOnInit() {
    this.clasesService.ListarClase().subscribe((clases: any) => {
      this.clases = clases;
    });
  }
}

