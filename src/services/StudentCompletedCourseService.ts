import http from "../http-common";
import { IStudentCompletedCourse } from "../types/Types";

const getAll = () => {
  return http.get<Array<IStudentCompletedCourse>>("/StudentCompletedCourse");
};

const StudentCompletedCourseService = {
  getAll,
};

export default StudentCompletedCourseService;
