import { FormikProps, FormikErrors, FormikTouched } from "formik";

//tipos de datos para la app
export type AuthContextProps = {
  auth: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

export type ResponseData = {
  message?: string;
  data?: any;
  success: boolean;
};

export type LoginData = {
  userName: string;
  password: string;
};

export type UserRole = 0 | 1 | 2 | 3 | 4;

export type User = {
  id?: string;
  userName: string;
  password?: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  identificationCard: string;
  dateBirth: string;
  age: number;
  dateAdmission: string;
};

export type CloudImage = {
  secure_url: string;
};

export type Student = {
  id?: string;
  number: number;
  nombre: string;
  nombreRepresentante: string;
  dni: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  telefono: string;
  email: string;
  file?: File | CloudImage;
};

export interface Period {
  id?: string;
  nombre: string;
  año: number;
}

export type Tuition = {
  id?: string;
  number: number
  student: Student;
  period: Period;
  course: Course;
  parallel: Parallel;
};

export type Course = {
  id?: string;
  name: string;
  description: string;
  level: string;
  subjects: Array<Subject>;
};

export type Parallel = {
  id?: string;
  name: string;
  limit: number;
  students: Array<Student>;
};

export type Teacher = {
  id?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero: string;
  direccion: string;
  telefono: string;
  email: string;
};

export type Subject = {
  id?: string;
  nombre: string;
  estado: string;
  profesor: Array<Teacher>;
};

export type Grade = {
  id?: string;
  student: Student;
  subject: Subject;
  grade: number;
  period: Period;
  teacher: Teacher;
};

//backups
export type Backup = {
  id?: string;
  student: any | Student;
  teachers: any | Teacher;
  courses: any | Courses;
  paralelos: any | Parallel;
  periodos: any | Period;
  matriculas: any | Tuition;
};

export type Auditory = {
  id?: string;
  date: string;
  user: string;
  action: string;
};

export interface ModalProps<T> {
  visible: boolean;
  close: () => void;
  onDone?: (data?: T) => void | Promise<void>;
}

export interface FormikComponentProps<T = Element> extends FormikProps<T> {
  formik: {
    values: T;
    handleChange: {
      (e: ChangeEvent<any>): void;
      <T_1 = string | ChangeEvent<T>>(field: T_1): T_1 extends ChangeEvent<T>
        ? void
        : (e: string | ChangeEvent<T>) => void;
    };
    touched: FormikTouched<T>;
    errors: FormikErrors<T>;
    setFieldValue: (
      field: string,
      value: T,
      shouldValidate?: boolean
    ) => Promise<void> | Promise<FormikErrors<T>>;
    setFieldError: (field: string, value: string) => void;
  };
}
