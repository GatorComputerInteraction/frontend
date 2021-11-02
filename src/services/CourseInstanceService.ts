import http from "../http-common";
import { ICourseInstance } from "types/Types";

const getAll = () => {
  return http.get<Array<ICourseInstance>>("/Courseinstance");
};

const CourseInstanceService = {
  getAll,
};

export default CourseInstanceService;
