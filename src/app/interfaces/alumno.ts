export interface Alumno {
  id : string
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  carrera: string;
  clases: String[];
  asistencias: Asistencia[];
}

export interface Asistencia {
  asistenciaId: String;
  alumnoId: String;
  presente: boolean;
}

