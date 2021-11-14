import http from "../http-common";
import { ICourseInstance } from "types/Types";

const getAll = () => {
  return http.get<Array<ICourseInstance>>("/Courseinstance");
};

const getBySemesterYear = (year: number, semester: string) => {
  return http.get<Array<ICourseInstance>>(
    `/Courseinstance/${year}/${semester}`
  );
};

const CourseInstanceService = {
  getAll,
  getBySemesterYear,
};

export default CourseInstanceService;
