import mongoose from "mongoose";
import {
  Auditory,
  Backup,
  CloudImage,
  Course,
  Parallel,
  Period,
  Student,
  Subject,
  Teacher,
  Tuition,
  User,
} from "../types";

const CloudImageSchema = new mongoose.Schema<CloudImage>(
  {
    // public_id: { type: String, },
    secure_url: { type: String },
  },
  { timestamps: true }
);
//Estudiante esquema de datos
const StudentSchema = new mongoose.Schema<Student>(
  {
    nombre: { type: String },
    nombreRepresentante: { type: String },
    apellido: { type: String },
    dni: { type: String },
    fechaNacimiento: { type: String },
    genero: { type: String },
    direccion: { type: String },
    telefono: { type: String },
    email: { type: String },
    file: { type: CloudImageSchema },
  },
  { timestamps: true }
);

// Duplicate the ID field.
StudentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
StudentSchema.set("toJSON", {
  virtuals: true,
});

export const StudentsModel =
  mongoose.models.Students || mongoose.model("Students", StudentSchema);

//Teachers
const TeacherSchema = new mongoose.Schema<Teacher>(
  {
    nombre: { type: String },
    apellido: { type: String },
    fechaNacimiento: { type: String },
    genero: { type: String },
    direccion: { type: String },
    telefono: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
TeacherSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TeacherSchema.set("toJSON", {
  virtuals: true,
});

export const TeachersModel =
  mongoose.models.Teachers || mongoose.model("Teachers", TeacherSchema);

//Materias
const MateriasSchema = new mongoose.Schema<Subject>({
  nombre: { type: String },
  estado: { type: String },
  profesor: { type: [TeacherSchema] },
});

// Duplicate the ID field.
MateriasSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
MateriasSchema.set("toJSON", {
  virtuals: true,
});

export const MateriasModel =
  mongoose.models.Materias || mongoose.model("Materias", MateriasSchema);

//Cursos
const CourseSchema = new mongoose.Schema<Course>({
  name: { type: String },
  description: { type: String },
  level: { type: String },
  subjects: { type: [MateriasSchema] },
});

// Duplicate the ID field.
CourseSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CourseSchema.set("toJSON", {
  virtuals: true,
});

export const CourseSModel =
  mongoose.models.Cursos || mongoose.model("Cursos", CourseSchema);

//Periodos
const PeriodosSchema = new mongoose.Schema<Period>({
  nombre: { type: String },
  año: { type: Number },
});

// Duplicate the ID field.
PeriodosSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
PeriodosSchema.set("toJSON", {
  virtuals: true,
});

export const PeriodModel =
  mongoose.models.Pediodos || mongoose.model("Pediodos", PeriodosSchema);

//Paralelos
const ParalellSchema = new mongoose.Schema<Parallel>({
  name: { type: String },
  limit: { type: Number },
  students: { type: [StudentSchema] },
});

// Duplicate the ID field.
ParalellSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
ParalellSchema.set("toJSON", {
  virtuals: true,
});

export const ParallelModel =
  mongoose.models.Paralelos || mongoose.model("Paralelos", ParalellSchema);

//Matriculas
const TiutionSchema = new mongoose.Schema<Tuition>({
  number: {type: Number},
  student: { type: StudentSchema },
  period: { type: PeriodosSchema },
  course: { type: CourseSchema },
  parallel: { type: ParalellSchema },
});

// Duplicate the ID field.
TiutionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TiutionSchema.set("toJSON", {
  virtuals: true,
});

export const TiutionSModel =
  mongoose.models.Matriculas || mongoose.model("Matriculas", TiutionSchema);

//Backup Students
const BackupStudentsSchema = new mongoose.Schema<Backup>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupStudentsSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupStudentsSchema.set("toJSON", {
  virtuals: true,
});

export const BackupStudentsModel =
  mongoose.models.BackupsStudents ||
  mongoose.model("BackupsStudents", BackupStudentsSchema);

//Backup Cursos
const BackupCursosSchema = new mongoose.Schema<Backup>(
  {
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupCursosSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupCursosSchema.set("toJSON", {
  virtuals: true,
});

export const BackupCursosModel =
  mongoose.models.BackupsCursos ||
  mongoose.model("BackupsCursos", BackupCursosSchema);

//Backup Paralelos
const BackupParalelosSchema = new mongoose.Schema<Backup>(
  {
    paralelos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "paralelos",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupParalelosSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupParalelosSchema.set("toJSON", {
  virtuals: true,
});

export const BackupParalelosModel =
  mongoose.models.BackupsParalelos ||
  mongoose.model("BackupsParalelos", BackupParalelosSchema);

//Backup Periodos
const BackupPeriodoSchema = new mongoose.Schema<Backup>(
  {
    periodos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "periodos",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupPeriodoSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupPeriodoSchema.set("toJSON", {
  virtuals: true,
});

export const BackupPeriodosModel =
  mongoose.models.BackupsPeriodos ||
  mongoose.model("BackupsPeriodos", BackupPeriodoSchema);

//Backup Teachers
const BackupTeachersSchema = new mongoose.Schema<Backup>(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupTeachersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupTeachersSchema.set("toJSON", {
  virtuals: true,
});

export const BackupTeachersModel =
  mongoose.models.BackupsTeachers ||
  mongoose.model("BackupsTeachers", BackupTeachersSchema);

//Backup Matriculas
const BackupMatriculasSchema = new mongoose.Schema<Backup>(
  {
    matriculas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "matriculas",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
BackupMatriculasSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
BackupMatriculasSchema.set("toJSON", {
  virtuals: true,
});

export const BackupMatriculasModel =
  mongoose.models.BackupsMatriculas ||
  mongoose.model("BackupsMatriculas", BackupMatriculasSchema);

//Users
const UserSchema = new mongoose.Schema<User>(
  {
    userName: { type: String },
    password: { type: String },
    email: { type: String },
    department: { type: String },
    role: { type: Number },
    name: { type: String },
    identificationCard: { type: String },
    dateBirth: { type: String },
    age: { type: Number },
    dateAdmission: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set("toJSON", {
  virtuals: true,
});

export const UserModel =
  mongoose.models.Users || mongoose.model("Users", UserSchema);

const AuditorySchema = new mongoose.Schema<Auditory>(
  {
    date: { type: String },
    user: { type: String },
    action: { type: String },
  },
  { timestamps: true }
);

// Duplicate the ID field.
AuditorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
AuditorySchema.set("toJSON", {
  virtuals: true,
});

export const AuditoryModel =
  mongoose.models.Auditory || mongoose.model("Auditory", AuditorySchema);
