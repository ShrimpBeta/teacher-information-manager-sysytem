
export class ClassTime {
  dayOfWeek: number = -1;
  start: number = -1;
  end: number = -1;
}

export class EditClassTime {
  dayOfWeek: number | null = null;
  start: number | null = null;
  end: number | null = null;
}

export class Course {
  id: string = "";
  teacherNames: string = "";
  courseName: string = "";
  courseLocation: string | null = null;
  courseType: string | null = null;
  courseWeeks: number[] = [];
  courseTimes: ClassTime[] = [];
  studentCount: number | null = null;
  color: string = "";
}

export class EditCourse {
  teacherNames: string | null = null;
  courseName: string | null = null;
  courseLocation: string | null = null;
  courseType: string | null = null;
  courseWeeks: number[] = [];
  courseTimes: EditClassTime[] = [];
  studentCount: number | null = null;
  color: string | null = null;
}

export class ClassSchedule {
  id: string = "";
  termName: string = "";
  startDate: Date = new Date();
  weekCount: number = 0;
  courses: Course[] = [];
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
}

export class EditClassSchedule {
  termName: string | null = null;
  startDate: Date | null = null;
  weekCount: number | null = null;
  courses: EditCourse[] = [];
}

export class ClassScheduleFilter {
  termName: string | null = null;
}

export class ClassSchedulePage {
  totalCount: number = 0;
  academicTerms: ClassSchedule[] = [];
}

export class NewClassScheduleData {
  termName: string = "";
  startDate: Date = new Date();
  weekCount: number = 0;
}

export interface AcademicResponse {
  error?: unknown;
  data?: {
    academicTerm: ClassSchedule
  }
}

export interface AcademicTermsByFilterResponse {
  error?: unknown;
  data?: {
    academicTermsByFilter: ClassSchedulePage
  }
}

export interface CreateAcademicResponse {
  error?: unknown;
  data?: {
    createAcademicTerm: ClassSchedule
  }
}

export interface UpdateAcademicResponse {
  error?: unknown;
  data?: {
    updateAcademicTerm: ClassSchedule
  }
}

export interface DeleteAcademicResponse {
  error?: unknown;
  data?: {
    deleteAcademicTerm: ClassSchedule
  }
}

export interface CreateCourseResponse {
  error?: unknown;
  data?: {
    createCourse: Course
  }
}

export interface UpdateCourseResponse {
  error?: unknown;
  data?: {
    updateCourse: Course
  }
}

export interface DeleteCourseResponse {
  error?: unknown;
  data?: {
    deleteCourse: Course
  }
}
