export interface Ialumnos {
            id: String,
            rut: String,
            nombre: String,
            apellido: String,
            correo: String,
            contrasena: String,
            carrera: String,
            clases: String[];
            asistencias: Asistencia[];
}

export interface Asistencia {
    asistenciaId: String;
    alumnoId: String;
    presente: boolean;
  }