export interface Alumno {
            rut: String,
            nombre: String,
            apellido: String,
            correo: String,
            contrasena: String,
            carrera: String,
            clases: number[],
            asistencias: String[]
}

export interface AlumnoAsistencia {
    id: string; // El ID del alumno
    presente: boolean; // true si está presente, false si está ausente
  }
