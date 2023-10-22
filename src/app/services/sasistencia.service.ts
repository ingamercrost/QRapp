import { Injectable } from '@angular/core';
import { Asistencia } from '../interfaces/asistencia';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SasistenciaService {

  private apiUrl = 'https://qrapp1.onrender.com'; // Reemplaza 'tu_url_api' con la URL de tu API

  constructor(private http: HttpClient) { }
  getAsistenciasByAlumnoId(alumnoId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/alumnos/${alumnoId}/asistencias`);
  }
  // Función para registrar asistencias para una clase
  Crearasistencia(newAsistencia: Asistencia):Observable<Asistencia>{{
    return this.http.post<Asistencia>(`${environment.apiURL}/asistencias`, newAsistencia)
  }
  
}
}
