export interface Asistencias {
    id : String,
    clase: String, // El ID de la clase a la que se asiste
    fecha: String, // La fecha de la asistencia en formato "DD/MM/AAAA" o "YYYY-MM-DD"
    profesor: String, // El ID del profesor que registra la asistencia
    alumnos: String[], // Un array de IDs de los alumnos presentes en la clase
  }

  export interface AlumnoAsistencia {
    alumnoId: string; // Cambia 'id' a 'alumnoId'
    presente: boolean;
  }
  
