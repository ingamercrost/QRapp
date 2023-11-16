import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ialumnos } from '../interfaces/ialumnos';
import { Alumno } from '../interfaces/alumno';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(private http:HttpClient,private firestore: AngularFirestore) { }

  ListarAlumnos(): Observable<Ialumnos>{
    return this.http.get<Ialumnos>(`${environment.apiURL}/alumnos`)
  }

  CrearAlumno(newAlumno: Alumno):Observable<Alumno>{
    return this.http.post<Alumno>(`${environment.apiURL}/alumnos`, newAlumno)
   }

   getAlumnoByid(id:String):Observable<Ialumnos>{
    return this.http.get<Ialumnos>(`${environment.apiURL}/alumnos/?id=${id}`)
   }

   actualizarAlumno(alumno:any):Observable<Ialumnos>{
    return this.http.put<Ialumnos>(`${environment.apiURL}/alumnos/${alumno.id}`,alumno)
   }

   eliminarAlumnoById(alumno:any):Observable<Ialumnos>{
    return this.http.delete<Ialumnos>(`${environment.apiURL}/alumnos/${alumno.id}`)
   }

   marcarAsistencia(alumnoId: string, asistenciaId: string) {
    return this.http.post(`${environment.apiURL}/alumnos/marcarAsistencia`, {
      alumnoId,
      asistenciaId,
    });
}
getAsistenciasByAlumnoId(alumnoId: string): Observable<any[]> {
  return this.http.get<any[]>(`${environment.apiURL}/alumnos/${alumnoId}/asistencias`);
}

actualizarAsistenciaAlumno(alumnoId: string, asistenciaId: string, presente: boolean): Observable<any> {
  const asistenciaData = {
    alumnoId,
    asistenciaId,
    presente
  };

  return this.http.put<any>(`${environment.apiURL}/alumnos/asistencias`, asistenciaData);
}

  getAlumnoByCorreo(correo: string): Observable<any> {
    // Utiliza AngularFirestore para buscar el alumno por su correo en Firestore
    // Aquí asumo que tienes una colección 'alumnos' en tu base de datos
    // y que el campo 'correo' se utiliza para buscar al alumno
    return this.firestore
      .collection('alumnos', (ref) => ref.where('correo', '==', correo))
      .valueChanges();
  }


  marcarPresente(alumnoId: string, asistenciaId: string): Promise<void> {
    // Actualiza el valor de 'presente' en la asistencia del alumno
    const asistenciaRef = this.firestore
      .collection('alumnos')
      .doc(alumnoId)
      .collection('asistencias')
      .doc(asistenciaId);

    return asistenciaRef.update({ presente: true });
  }
}



