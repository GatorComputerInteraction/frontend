interface IStudent {
  ufId: number;
  firstName: string;
  lastName: string;
  degreeId: number;
}

interface ICourse {
  courseId: number;
  courseName: string;
  credits: number;
}

interface ICourseInstance {
  instanceId: number;
  semester: string;
  year: number;
  courseId: number;
  slotId: number;
}

interface IRequirementType {
  requirementType: number;
  name: string;
}

interface ITimeslot {
  slotId: number;
  day: string;
  periodId1: number;
  periodId2: number;
  periodId3: number;
}

interface IStudentSchedule {
  ufId: number;
  instanceId: number;
}

interface IDegreeCourse {
  degreeId: number;
  courseId: number;
  requirementType: number;
}

export interface StudentClass {
  courseId: number;
  classId: number;
  courseName: string;
  credits: number;
  semester: string;
  year: number;
  day: string;
  periods: number[];
}

export interface IStudentCompletedCourse {
  ufId: number;
  courseId: number;
}

export interface IDegree {
  degreeId: number;
  degreeName: string;
}

export type {
  IStudent,
  ICourse,
  ICourseInstance,
  IRequirementType,
  ITimeslot,
  IStudentSchedule,
  IDegreeCourse,
};
