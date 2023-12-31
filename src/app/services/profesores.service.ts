import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profesores } from '../interfaces/iprofesores';
import { Profesor } from '../interfaces/profesor';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService {

  constructor(private http:HttpClient,private firestore: AngularFirestore) { }
  ListarProfesores(): Observable<Profesores>{
    return this.http.get<Profesores>(`${environment.apiURL}/profesores`)
  }

  CrearProfesores(profesor: Profesor): Promise<any> {
    // Agrega el profesor a la colección "profesores" en Firestore
    return this.firestore.collection('profesores').add(profesor);
  }

   getProfesorByid(id:String):Observable<Profesores>{
    return this.http.get<Profesores>(`${environment.apiURL}/Profesores/?id=${id}`)
   }

   actualizarProfesor(Profesor:any):Observable<Profesores>{
    return this.http.put<Profesores>(`${environment.apiURL}/Profesores/${Profesor.id}`,Profesor)
   }

   eliminarProfesoresById(Profesor:any):Observable<Profesores>{
    return this.http.delete<Profesores>(`${environment.apiURL}/Profesores/${Profesor.id}`)
   }


}

