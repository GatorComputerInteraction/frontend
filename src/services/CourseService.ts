import http from "../http-common";
import { ICourse } from "types/Types";

const getAll = () => {
  return http.get<Array<ICourse>>("/Course");
};

const CourseService = {
  getAll,
};

export default CourseService;
