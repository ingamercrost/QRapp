import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iclases } from '../interfaces/iclases';
import { environment } from 'src/environments/environment';
import { Iclase } from '../interfaces/iclase';

@Injectable({
  providedIn: 'root'
})
export class SClasesService {

  constructor(private http:HttpClient) { }

  ListarClase(): Observable<Iclases>{
    return this.http.get<Iclases>(`${environment.apiURL}/clases`)
  }

  CrearClase(newClase: Iclase):Observable<Iclase>{
    return this.http.post<Iclase>(`${environment.apiURL}/clases`, newClase)
   }

   getClaseByid(id:String):Observable<Iclases>{
    return this.http.get<Iclases>(`${environment.apiURL}/clases/?id=${id}`)
   }

   actualizarClase(clase:any):Observable<Iclases>{
    return this.http.put<Iclases>(`${environment.apiURL}/clases/${clase.id}`,clase)
   }

   eliminarClaseById(clase:any):Observable<Iclases>{
    return this.http.delete<Iclases>(`${environment.apiURL}/clases/${clase.id}`)
   }

   agregarAlumnoAClase(claseId: string, alumnoId: string): Observable<any> {
    const url = `${environment.apiURL}/clases/${claseId}/alumnos/${alumnoId}`;
    return this.http.post(url, null);
  }
}
